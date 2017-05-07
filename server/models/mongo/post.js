import {Schema} from 'mongoose'

export default new Schema({
    pageURL: String,
    posterNick: String,
    pageTitle: String,
    upvotes: Number
});