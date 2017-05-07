/* global describe it beforeEach afterEach */
import { assert } from 'chai'
import sinon from 'sinon'
import PostResolver from '../../../models/schema/postResolvers'
import mongoose from 'mongoose'
import rp from 'request-promise'

describe('PostResolvers', () => {
  let modelStub
  let postResolver
  beforeEach(() => {
    sinon.stub(mongoose, 'connect')
    modelStub = sinon.stub(mongoose, 'model')
    postResolver = new PostResolver()
  })

  afterEach(() => {
    mongoose.connect.restore()
    mongoose.model.restore()
  })

  describe('Query resolver', () => {
    it('should find all Post models and order them by decreasing upvotes', done => {
      // setup
      const modelFind = sinon.stub().returns(Promise.resolve())
      modelStub.returns({ find: modelFind })
      postResolver = new PostResolver()
      // action
      postResolver.resolvers.Query.posts()
      .then(() => {
        // assert
        assert.equal(modelFind.calledOnce, true)
        assert.deepEqual(modelFind.getCall(0).args[0], {})
        assert.deepEqual(modelFind.getCall(0).args[1], {})
        assert.deepEqual(modelFind.getCall(0).args[2], { sort: { upvotes: 'descending' } })
        done()
      })
      .catch(done)
    })

    it('should add an `id` field that holds the tech id of the object for each element found', done => {
      // setup
      const modelFind = sinon.stub().returns(Promise.resolve({ _id: 1234 }))
      modelStub.returns({ find: modelFind })
      postResolver = new PostResolver()
      // action
      postResolver.resolvers.Query.posts()
      .then(document => {
        // assert
        assert.equal(document.id, 1234)
        done()
      })
      .catch(done)
    })

    it('should return null if there was an error fetching data', done => {
      // setup
      const modelFind = sinon.stub().returns(Promise.reject(new Error('foobar')))
      modelStub.returns({ find: modelFind })
      postResolver = new PostResolver()
      // action
      postResolver.resolvers.Query.posts()
      .then(document => {
        // assert
        assert.deepEqual(document, null)
        done()
      })
      .catch(done)
    })
  })

  describe('updatePostVotes', () => {
    it('should increment the number of the post by 2 if found', done => {
      // setup
      const saveStub = sinon.stub().returns(Promise.resolve())
      const modelFindOne = sinon.stub().returns(Promise.resolve({ upvotes: 1, save: saveStub }))
      postResolver = new PostResolver()
      // action
      postResolver.updatePostVotes({ findOne: modelFindOne }, { postId: 1234 }, 2, 'up')
      .then(documentToUpvote => {
        // assert
        assert.equal(saveStub.calledOnce, true)
        assert.deepEqual(documentToUpvote.upvotes, 3)
        done()
      })
      .catch(done)
    })

    it('should return an error if post lookup failed', done => {
      // setup
      const saveStub = sinon.stub().returns(Promise.reject(new Error()))
      const modelFindOne = sinon.stub().returns(Promise.resolve({ upvotes: 1, save: saveStub }))
      postResolver = new PostResolver()
      // action
      postResolver.updatePostVotes({ findOne: modelFindOne }, { postId: 1234 }, 2, 'up')
      .then(documentToUpvote => {
        // assert
        assert.equal(documentToUpvote.message, 'Ouch (upvote post save)!')
        done()
      })
      .catch(done)
    })

    it('should return an error if post save failed', done => {
      // setup
      const modelFindOne = sinon.stub().returns(Promise.reject(new Error()))
      postResolver = new PostResolver()
      // action
      postResolver.updatePostVotes({ findOne: modelFindOne }, { postId: 1234 }, 2, 'up')
      .then(documentToUpvote => {
        // assert
        assert.equal(documentToUpvote.message, 'Ouch (upvote post lookup)!')
        done()
      })
      .catch(done)
    })
  })

  describe('Mutations', () => {
    describe('upvote post', () => {
      it('should increment the post upvotes by 1', done => {
        // setup
        sinon.stub(postResolver, 'updatePostVotes').returns(Promise.resolve())
        // action
        postResolver.resolvers.Mutation.upvotePost(null, { postId: 1234 })
        .then(() => {
          // assert
          assert.equal(postResolver.updatePostVotes.calledOnce, true)
          assert.equal(postResolver.updatePostVotes.getCall(0).args[2], 1)
          assert.equal(postResolver.updatePostVotes.getCall(0).args[3], 'up')
          done()
        })
        .catch(done)
      })
    })

    describe('downvote post', () => {
      it('should decrement the post upvotes by 1', done => {
        // setup
        sinon.stub(postResolver, 'updatePostVotes').returns(Promise.resolve())
        // action
        postResolver.resolvers.Mutation.downvotePost(null, { postId: 1234 })
        .then(() => {
          // assert
          assert.equal(postResolver.updatePostVotes.calledOnce, true)
          assert.equal(postResolver.updatePostVotes.getCall(0).args[2], -1)
          assert.equal(postResolver.updatePostVotes.getCall(0).args[3], 'down')
          done()
        })
        .catch(done)
      })
    })

    describe('addPost', () => {
      let getStub
      beforeEach(() => {
        getStub = sinon.stub(rp, 'get')
      })

      afterEach(() => {
        getStub.restore()
      })

      it('should parse the page\'s title on the fly, then save a new post', done => {
        // setup
        sinon.stub(postResolver, 'parsePageTitle').returns('page title')
        sinon.stub(postResolver, 'saveNewPost')
        getStub.returns(Promise.resolve())
        // action
        postResolver.resolvers.Mutation.addPost(null, { posterNick: 'foo', pageURL: 'bar' })
        .then(() => {
          // assert
          assert.equal(postResolver.parsePageTitle.calledOnce, true)
          assert.equal(postResolver.saveNewPost.calledOnce, true)
          assert.deepEqual(postResolver.saveNewPost.getCall(0).args[1], {
            posterNick: 'foo',
            pageURL: 'http://bar',
            pageTitle: 'page title',
            upvotes: 0
          })
          done()
        })
        .catch(done)
      })

      it('should prefix the page\'s URL by `http://` if there is no protocol declaration in the given URL', done => {
        // setup
        getStub.returns(Promise.resolve())
        sinon.stub(postResolver, 'saveNewPost')
        sinon.stub(postResolver, 'parsePageTitle')
        // action
        postResolver.resolvers.Mutation.addPost(null, { pageURL: 'bar.com' })
        .then(() => {
          // assert
          assert.equal(rp.get.calledOnce, true)
          assert.equal(rp.get.getCall(0).args[0].uri, 'http://bar.com')
          done()
        })
        .catch(done)
      })
    })
  })
  describe('parsePageTitle', () => {
    it('should return the page title inside of found <title> tag if found', () => {
      // setup
      const cheerioStub = sinon.stub().returns({ text: () => 'title found in <title> tag' })
      // action
      const actual = postResolver.parsePageTitle(cheerioStub)
      // assert
      assert.equal(actual, 'title found in <title> tag')
    })

    it('should return a default message if <title> tag empty or not found', () => {
      // setup
      const postResolver = new PostResolver()
      const cheerioStub = sinon.stub().returns({ text: () => '' })
      // action
      const actual = postResolver.parsePageTitle(cheerioStub)
      // assert
      assert.equal(actual, 'No title available')
    })
  })

  describe('saveNewPost', () => {
    it('should create a new Model based on post data, save it & resolve w/ saved data', done => {
      // setup
      let saveStub = sinon.stub().returns(Promise.resolve())
      const model = sinon.stub().returns({ save: saveStub })
      // action
      postResolver.saveNewPost(model, { foo: 'bar' })
      .then(() => {
        // assert
        assert.equal(model.calledOnce, true)
        assert.deepEqual(model.getCall(0).args, [{ foo: 'bar' }])
        assert.equal(saveStub.calledOnce, true)
        done()
      })
      .catch(done)
    })

    it('should return an error if save failed', done => {
      // setup
      let saveStub = sinon.stub().returns(Promise.reject(new Error('some error')))
      const model = sinon.stub().returns({ save: saveStub })
      // action
      postResolver.saveNewPost(model, { foo: 'bar' })
      .then(data => {
        // assert
        assert.equal(saveStub.calledOnce, true)
        assert.equal(data.message, 'Ouch (addPost)!')
        done()
      })
      .catch(done)
    })
  })
})
