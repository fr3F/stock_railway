const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Utilisateur = require('../models/utilisateur');
const JWTStrategy = require('./strategies/JWTStrategy');
const utilisateurRepository = require('./utilisateur.service');
const { saveTokenContext } = require('../middleware/auth.middleware');

class AuthService {
    constructor(strategy) {
        this.strategy = strategy;
    }

    async register(role, email_ut, mdp_ut) {
        const hashedMdp_ut = await bcrypt.hash(mdp_ut, 8);        
        const utilisateur = await Utilisateur.create({
            role, 
            email_ut, 
            mdp_ut: hashedMdp_ut
        });
        return utilisateur;
    }

    async login(email_ut, mdp_ut, req) {
        const utilisateur = await Utilisateur.findOne({where: { email_ut }});

        if (!utilisateur) {
            throw new Error('Utilisateur non trouvé');
        }

        // Vérifier le mot de passe
        const isValidPassword = await bcrypt.compare(mdp_ut, utilisateur.mdp_ut);
        if (!isValidPassword) {
            throw new Error('Mot de passe incorrect');
        }

        const role = utilisateur.role;
        
        // Utiliser JWT_SECRET depuis .env
        const token = jwt.sign(
            {
                id: utilisateur.id_ut,
                role: role
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' } 
        );

        // Sauvegarder le contexte (IP + User-Agent)
        saveTokenContext(token, req);

        return {
            utilisateur: {
                id_ut: utilisateur.id_ut,
                email_ut: utilisateur.email_ut,
                role: role
            },
            token
        };
    }

    async authenticate(token) {
        return this.strategy.authenticate(token, {
            secretOrkey: process.env.JWT_SECRET
        });
    }

    async findUtilById(id) {
        return await utilisateurRepository.findUtilById(id);
    }
}

module.exports = new AuthService(JWTStrategy);