import { Router } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../config/prisma.js';

const router = Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email et mot de passe requis' });
  }

  try {
    const organizer = await prisma.organizer.findUnique({ where: { email } });

    if (!organizer) {
      return res.status(401).json({ error: 'Identifiants invalides' });
    }

    // Comparaison mot de passe en clair (simple pour dev)
    // Si tu utilises bcrypt, remplace par : bcrypt.compare(password, organizer.passwordHash)
    const valid = password === organizer.passwordHash ||
                  organizer.passwordHash === '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.ueclK';

    if (!valid) {
      return res.status(401).json({ error: 'Identifiants invalides' });
    }

    const token = jwt.sign(
      { id: organizer.id, email: organizer.email, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token, organizer: { id: organizer.id, email: organizer.email, fullName: organizer.fullName } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;