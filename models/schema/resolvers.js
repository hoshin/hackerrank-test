const posts = [
    {
        id: 1,
        pageTitle: 'Title 1',
        pageURL: 'URL 1',
        posterNick: 'Nick 1',
        upvotes: 42
    }, {
        id: 2,
        pageTitle: 'Title 2',
        pageURL: 'URL 2',
        posterNick: 'Nick 2',
        upvotes: 3
    }
];


let nextId = 3;

export const resolvers = {
    Query: {
        posts: () => {
            return posts;
        }
    },
    Mutation: {
        addPost: (root, args) => {
            const newPost = { id: nextId++, posterNick: args.posterNick, pageURL: args.pageURL, upvotes:0};
            posts.push(newPost);
            return newPost;
        },
        upvotePost: (root, args) => {
            let postToUpvote = posts.find(post => {
                return post.id == args.postId
            });

            if(postToUpvote){
                postToUpvote.upvotes+=1;
            }
            return postToUpvote || {};
        }

        // downvotePost: (root, args) => {
        //     let postToUpvote = posts.find(post => {
        //         return post.id == args.postId
        //     });
        //
        //     if(postToUpvote){
        //         postToUpvote.upvotes-=1;
        //     }
        //     return postToUpvote || {};
        // },
    }
};