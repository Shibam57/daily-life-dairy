const { isValidObjectId } = require('mongoose');
const Data  = require('../models/data.model');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const mongoose = require('mongoose')

const addNote = asyncHandler(async (req, res)=>{
    const { title, description } = req.body;

    if(!title || !description){
        throw new ApiError(400, "Title and description are required");
    }

    const note = await Data.create({
        title,
        description,
        owner: req.user?._id
    })

    if(!note){
        throw new ApiError(500, "Failed to create note")
    }

    return res.status(200)
    .json(new ApiResponse(200, note, "Note created successfully"))
})

const updateNote = asyncHandler(async(req, res)=>{
    const {noteId} = req.params;
    const {title, description, isPinned} = req.body;

    if(!isValidObjectId(noteId)){
        throw new ApiError(400, "Note Id is required");
    }

    const note = await Data.findById(noteId)

    if(req.user?._id.toString() !== note.owner.toString()){
        throw new ApiError(403, "You are not authorized to update this note");
    }

    if(!title && !description){
        throw new ApiError(400, "Title or description is required");
    }

    const data = await Data.findByIdAndUpdate(
        noteId,
        {
            $set: {
                title, 
                description,
                isPinned
            }
        },
        {
            new: true,
            runValidators: true
        }
    )

    if(!data){
        throw new ApiError(404, "Note not found")
    }

    return res.status(200)
    .json(new ApiResponse(200, data, "Note updated successfully"))
})

const deleteNote = asyncHandler(async(req, res)=>{
    const {noteId} = req.params;

    if(!isValidObjectId(noteId)){
        throw new ApiError(400, "Note Id is required");
    }

    const note = await Data.findById(noteId)

    if(req.user?._id.toString() !== note.owner.toString()){
        throw new ApiError(403, "You are not authorized to update this note");
    }

    await note.deleteOne()

    return res.status(200)
    .json(new ApiResponse(200, {}, "Note deleted successfully"))
})

const updateNotePinned = asyncHandler(async(req, res)=>{
    const {noteId} = req.params;
    const {isPinned} = req.body;

    if(!isValidObjectId(noteId)){
        throw new ApiError(400, "Note Id is required");
    }

    const note = await Data.findById(noteId)

    if(req.user?._id.toString() !== note.owner.toString()){
        throw new ApiError(403, "You are not authorized to update this note");
    }

    note.isPinned = isPinned;
    const updateNote = await note.save()

    if(!updateNote){
        throw new ApiError(404, "Note not found");
    }

    return res.status(200)
    .json(new ApiResponse(200, updateNote, "Note pinned status updated successfully"))
})

const getAllNotes = asyncHandler(async(req, res)=>{
    const {page=1, limit=10, query, sortBy = "createdAt", sortType = "desc"} = req.query;

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const skip = (pageNumber - 1) * limitNumber;

    const userId=req.user?._id; 

    if(!userId){
        throw new ApiError(401, "Unauthorized")
    }

    const matchStage = {
        owner:new mongoose.Types.ObjectId(userId),
        ...(query && {
            $or: [
                { title: { $regex: query, $options: 'i'}},
                { description: { $regex: query, $options: 'i'}}
            ]
        })
    }

    const sortStage = {
        [sortBy]: sortType === 'asc' ? 1:-1
    }

    const notes = await Data.aggregate([
        {
            $match: matchStage
        },
        {
            $lookup: {
                from: 'users',
                localField: 'owner',
                foreignField: '_id',
                as: 'owner'
            }
        },
        {
            $unwind: "$owner"
        },
        {
            $project: {
                _id: 1,
                title: 1,
                description: 1,
                isPinned: 1,
                createdAt: 1,
                updatedAt: 1,
                owner: {
                    _id: "$owner._id",
                    fullname: "$owner.fullname",
                    username: "$owner.username",
                    avatar: "$owner.avatar"
                }
            }
        },
        {
            $sort: sortStage
        },
        {
            $skip: skip
        },
        {
            $limit: limitNumber
        }
    ])

    if(!notes || notes?.length === 0){
        throw new ApiError(404, "No notes found")
    }

    return res.status(200)
    .json(new ApiResponse(200, notes, "Notes fetched successfully"))
})

const searchNotes = asyncHandler(async(req, res)=>{
    const {query, page=1, limit=10} = req.query

    if(!query){
        throw new ApiError(400, "Query is required");
    }

    const pageNumber = parseInt(page)
    const limitNumber = parseInt(limit)
    const skip = (pageNumber - 1) * limitNumber;

    const notes = await Data.find({
        owner: req.user?._id,
        $or: [
            { title: { $regex: new RegExp(query, "i") } }
        ]
    })
    .skip(skip)
    .limit(limitNumber)
    .sort({ createdAt: -1 })
    
    if(!notes){
        throw new ApiError(404, "No notes found matching the query");
    }

    return res.status(200)
    .json(new ApiResponse(200, notes, "Notes fetched successfully"))
})

const getSingleNote = asyncHandler(async(req, res)=>{
    const {noteId} = req.params
    const note = await Data.findById(noteId).populate("owner", "-password -refreshToken");
    
    if(!note){
        throw new ApiError(404, "Note not found");
    }

    return res.status(200)
    .json(new ApiResponse(200, note, "note successfully"))
})

module.exports = {
    addNote,
    updateNote,
    deleteNote,
    updateNotePinned,
    getAllNotes,
    searchNotes,
    getSingleNote
}