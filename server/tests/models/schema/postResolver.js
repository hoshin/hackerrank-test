import {assert} from 'chai'
import sinon from 'sinon'
import PostResolver from '../../../models/schema/postResolvers'
import mongoose from 'mongoose'

describe('PostResolvers', () => {
  let modelStub;
  let postResolver;
  beforeEach(() => {
    sinon.stub(mongoose, 'connect');
    modelStub = sinon.stub(mongoose, 'model');
  })

  afterEach(() => {
    mongoose.connect.restore();
    mongoose.model.restore();
  })

  describe('Query resolver', () => {
    it('should find all Post models and order them by decreasing upvotes', () => {
      //setup
      const modelFind = sinon.stub().returns(Promise.resolve());
      modelStub.returns({find:modelFind})
      postResolver = new PostResolver();
      //action
      postResolver.resolvers.Query.posts()
      .then(() => {
        //assert
        assert.equal(modelFind.calledOnce, true);
        assert.deepEqual(modelFind.getCall(0).args[0], {});
        assert.deepEqual(modelFind.getCall(0).args[1], {});
        assert.deepEqual(modelFind.getCall(0).args[2], {sort:{upvotes:'descending'}});
      });
    });

    it('should add an `id` field that holds the tech id of the object for each element found', () => {
      //setup
      const modelFind = sinon.stub().returns(Promise.resolve({_id:1234}));
      modelStub.returns({find:modelFind})
      postResolver = new PostResolver();
      //action
      postResolver.resolvers.Query.posts()
      .then(document => {
        //assert
        assert.equal(document.id, 1234);
      });

    });

    it('should return null if there was an error fetching data', done => {
      //setup
      const modelFind = sinon.stub().returns(Promise.reject(new Error('foobar')));
      modelStub.returns({find:modelFind})
      postResolver = new PostResolver();
      //action
      postResolver.resolvers.Query.posts()
      .then(document => {
        //assert
        assert.deepEqual(document, null);
        done();
      })
      .catch(err => {
        done(err);
      });
    });
  });

  describe('Mutations', () => {
    describe('upvote post', () => {
      it('should increment the number of the post by 1 if found', done => {
        //setup
        const saveStub = sinon.stub().returns(Promise.resolve());
        const modelFindOne = sinon.stub().returns(Promise.resolve({upvotes:1, save:saveStub}));
        modelStub.returns({findOne:modelFindOne})
        postResolver = new PostResolver();
        //action
        postResolver.resolvers.Mutation.upvotePost(null, {postId:1234})
        .then(documentToUpvote => {
          //assert
          assert.equal(saveStub.calledOnce, true);
          assert.deepEqual(documentToUpvote.upvotes, 2);
          done();
        })
        .catch(err => {
          done(err);
        });
      });

      it('should return an error if post lookup failed', done => {
        //setup
        const saveStub = sinon.stub().returns(Promise.reject());
        const modelFindOne = sinon.stub().returns(Promise.resolve({upvotes:1, save:saveStub}));
        modelStub.returns({findOne:modelFindOne})
        postResolver = new PostResolver();
        //action
        postResolver.resolvers.Mutation.upvotePost(null, {postId:1234})
        .then(documentToUpvote => {
          //assert
          assert.equal(documentToUpvote.message, 'Ouch (upvote post save)!');
          done();
        })
        .catch(err => {
          done(err);
        });
      });
      it('should return an error if post save failed', done => {
        //setup
        const modelFindOne = sinon.stub().returns(Promise.reject());
        modelStub.returns({findOne:modelFindOne})
        postResolver = new PostResolver();
        //action
        postResolver.resolvers.Mutation.upvotePost(null, {postId:1234})
        .then(documentToUpvote => {
          //assert
          assert.equal(documentToUpvote.message, 'Ouch (upvote post lookup)!');
          done();
        })
        .catch(err => {
          done(err);
        });
      });
    });

    describe('downvote post', () => {
      it('should decrement the number of the post by 1 if found', done => {
        //setup
        const saveStub = sinon.stub().returns(Promise.resolve());
        const modelFindOne = sinon.stub().returns(Promise.resolve({upvotes:1, save:saveStub}));
        modelStub.returns({findOne:modelFindOne})
        postResolver = new PostResolver();
        //action
        postResolver.resolvers.Mutation.downvotePost(null, {postId:1234})
        .then(documentToUpvote => {
          //assert
          assert.equal(saveStub.calledOnce, true);
          assert.deepEqual(documentToUpvote.upvotes, 0);
          done();
        })
        .catch(err => {
          done(err);
        });
      });

      it('should return an error if post lookup failed', done => {
        //setup
        const saveStub = sinon.stub().returns(Promise.reject());
        const modelFindOne = sinon.stub().returns(Promise.resolve({upvotes:1, save:saveStub}));
        modelStub.returns({findOne:modelFindOne})
        postResolver = new PostResolver();
        //action
        postResolver.resolvers.Mutation.downvotePost(null, {postId:1234})
        .then(documentToUpvote => {
          //assert
          assert.equal(documentToUpvote.message, 'Ouch (downvote post save)!');
          done();
        })
        .catch(err => {
          done(err);
        });
      });

      it('should return an error if post save failed', done => {
        //setup
        const modelFindOne = sinon.stub().returns(Promise.reject());
        modelStub.returns({findOne:modelFindOne})
        postResolver = new PostResolver();
        //action
        postResolver.resolvers.Mutation.downvotePost(null, {postId:1234})
        .then(documentToUpvote => {
          //assert
          assert.equal(documentToUpvote.message, 'Ouch (downvote post lookup)!');
          done();
        })
        .catch(err => {
          done(err);
        });
      });
    });

    describe('addPost', () => {
      it('should retrieve the page\'s title on the fly, then save a new post', () => {
        //setup

        //action

        //assert

      });
    });
  });
});