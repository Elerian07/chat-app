import { model } from 'mongoose';

// find
export const find = async ({ model, condition = {}, select = "", limit = 10, skip = 0, populate = [] } = {}) => {
    let result = await model.find(condition).skip(skip).limit(limit).select(select).populate(populate);
    return result;
}
export const findOne = async ({ model, condition = {}, select, populate = [] } = {}) => {
    let result = await model.findOne(condition).select(select).populate(populate);
    return result;
}
export const findById = async ({ model, condition, select, populate = [] } = {}) => {
    let result = await model.findById(condition).select(select).populate(populate);
    return result;
}
export const findByIdAndUpdate = async ({ model, condition, data = {}, options } = {}) => {
    const result = await model.findByIdAndUpdate(condition, data, options);
    return result;
}
export const findOneAndUpdate = async ({ model, condition = {}, data = {}, options = {} } = {}) => {
    const result = await model.findOneAndUpdate(condition, data, options);
    return result;
}
export const findByIdAndDelete = async ({ model, condition = {} } = {}) => {
    const result = await model.findByIdAndDelete(condition);
    return result;
}

//insert
export const create = async ({ model, data } = {}) => {
    let newModel = await new model(data);
    let result = await newModel.save();
    return result
}

export const insertMany = async ({ model, data } = {}) => {
    let result = await model.insertMany(data);
    return result
}

// update

export const updateOne = async ({ model, condition = {}, data = {}, options = {} } = {}) => {
    const result = await model.updateOne(condition, data, options);
    return result;
}

//delete

export const deleteOne = async ({ model, condition = {}, filter = {} } = {}) => {
    const deleted = await model.deleteOne(condition, filter);
    return deleted;
}

export const deleteMany = async ({ model, condition = {} } = {}) => {
    const deleted = await model.deleteMany(condition);
    return deleted
}