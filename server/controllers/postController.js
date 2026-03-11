import Post from '../models/Post.js';

export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find({ published: true })
      .populate('author', 'username avatar')
      .sort({ createdAt: -1 });

    const result = posts.map(p => {
      const obj = p.toObject();
      obj.author._id = obj.author._id.toString();
      return obj;
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPostBySlug = async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug })
      .populate('author', 'username avatar');

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const obj = post.toObject();
    obj.author._id = obj.author._id.toString();

    res.json(obj);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createPost = async (req, res) => {
  try {
    const { title, content, tags } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    const post = await Post.create({
      title,
      content,
      tags: tags || [],
      author: req.user._id,
    });

    await post.populate('author', 'username avatar');

    const obj = post.toObject();
    obj.author._id = obj.author._id.toString();

    res.status(201).json(obj);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { title, content, tags, published } = req.body;

    if (title) post.title = title;
    if (content) post.content = content;
    if (tags) post.tags = tags;
    if (published !== undefined) post.published = published;

    const updated = await post.save();
    await updated.populate('author', 'username avatar');

    const obj = updated.toObject();
    obj.author._id = obj.author._id.toString();

    res.json(obj);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await post.deleteOne();
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};