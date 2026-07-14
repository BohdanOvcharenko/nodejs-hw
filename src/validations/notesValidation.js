import { Joi, Segments } from "celebrate";
import { isValidObjectId } from 'mongoose';
import { TAGS } from "../constants/tags.js";


const objectIdValidator = (value, helpers) => {
  return !isValidObjectId(value) ? helpers.message('Invalid id format') : value;
};

export const noteIdSchema = {
  [Segments.PARAMS]: Joi.object({
    noteId: Joi.string().custom(objectIdValidator).required(),
  })
};

export const getAllNotesSchema = {
  [Segments.QUERY]: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    perPage: Joi.number().integer().min(5).max(20).default(10),
    // title: Joi.string().min(3).max(100),
    // content: Joi.string().min(10).max(1000),
    search: Joi.string().trim().allow("").min(2).max(100),
    tag: Joi.string().valid(...TAGS),
  })
};

export const createNoteSchema = {
  [Segments.BODY]: Joi.object({
    title: Joi.string().min(1).max(100).required(),
    content: Joi.string().allow('').max(1000),
    tag: Joi.string().valid(...TAGS),
  }),
};

export const updateNoteSchema = {
  [Segments.PARAMS]: Joi.object({
    noteId: Joi.string().custom(objectIdValidator).required(),
  }),
  [Segments.BODY]: Joi.object({
    title: Joi.string().min(1).max(100),
    content: Joi.string().allow('').max(1000),
    tag: Joi.string().valid(...TAGS),
  }).min(1),
};


