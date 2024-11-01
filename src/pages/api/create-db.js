import CreateDB from '../../../sql/CreateDB';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      await CreateDB();
      res.status(200).json({ message: 'Database created successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to create database' });
    }
  }
}
