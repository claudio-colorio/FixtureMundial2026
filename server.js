const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Base de Datos Oficializada segun el Listado Correcto
const teamsDatabase = {
    "MEX": { name: "México", group: "A", titles: 0, ranking: 15 },
    "RSA": { name: "Sudáfrica", group: "A", titles: 0, ranking: 59 },
    "KOR": { name: "Corea del Sur", group: "A", titles: 0, ranking: 23 },
    "CZE": { name: "Chequia", group: "A", titles: 0, ranking: 40 },
    
    "CAN": { name: "Canadá", group: "B", titles: 0, ranking: 49 },
    "BIH": { name: "Bosnia y Herzegovina", group: "B", titles: 0, ranking: 74 },
    "QAT": { name: "Qatar", group: "B", titles: 0, ranking: 34 },
    "SUI": { name: "Suiza", group: "B", titles: 0, ranking: 10 },
    
    "BRA": { name: "Brasil", group: "C", titles: 5, ranking: 5 },
    "MAR": { name: "Marruecos", group: "C", titles: 0, ranking: 13 },
    "HAI": { name: "Haití", group: "C", titles: 0, ranking: 86 },
    "SCO": { name: "Escocia", group: "C", titles: 0, ranking: 39 },
    
    "USA": { name: "Estados Unidos", group: "D", titles: 0, ranking: 11 },
    "PAR": { name: "Paraguay", group: "D", titles: 0, ranking: 56 },
    "AUS": { name: "Australia", group: "D", titles: 0, ranking: 24 },
    "TUR": { name: "Turquía", group: "D", titles: 0, ranking: 26 },
    
    "GER": { name: "Alemania", group: "E", titles: 4, ranking: 16 },
    "CUW": { name: "Curazao", group: "E", titles: 0, ranking: 88 },
    "CIV": { name: "Costa de Marfil", group: "E", titles: 0, ranking: 38 },
    "ECU": { name: "Ecuador", group: "E", titles: 0, ranking: 31 },
    
    "NED": { name: "Países Bajos", group: "F", titles: 0, ranking: 7 },
    "JPN": { name: "Japón", group: "F", titles: 0, ranking: 18 },
    "SWE": { name: "Suecia", group: "F", titles: 0, ranking: 27 },
    "TUN": { name: "Túnez", group: "F", titles: 0, ranking: 35 },
    
    "IRN": { name: "Irán", group: "G", titles: 0, ranking: 20 },
    "NZL": { name: "Nueva Zelanda", group: "G", titles: 0, ranking: 85 },
    "BEL": { name: "Bélgica", group: "G", titles: 0, ranking: 8 },
    "EGY": { name: "Egipto", group: "G", titles: 0, ranking: 36 },
    
    "ESP": { name: "España", group: "H", titles: 1, ranking: 3 },
    "CPV": { name: "Cabo Verde", group: "H", titles: 0, ranking: 65 },
    "KSA": { name: "Arabia Saudita", group: "H", titles: 0, ranking: 53 },
    "URU": { name: "Uruguay", group: "H", titles: 1, ranking: 14 },
    
    "FRA": { name: "Francia", group: "I", titles: 2, ranking: 2 },
    "SEN": { name: "Senegal", group: "I", titles: 0, ranking: 21 },
    "IRQ": { name: "Irak", group: "I", titles: 0, ranking: 55 },
    "NOR": { name: "Noruega", group: "I", titles: 0, ranking: 44 },
    
    "ARG": { name: "Argentina", group: "J", titles: 3, ranking: 1 },
    "ALG": { name: "Argelia", group: "J", titles: 0, ranking: 41 },
    "AUT": { name: "Austria", group: "J", titles: 0, ranking: 22 },
    "JOR": { name: "Jordania", group: "J", titles: 0, ranking: 68 },
    
    "POR": { name: "Portugal", group: "K", titles: 0, ranking: 6 },
    "COD": { name: "Congo (RDC)", group: "K", titles: 0, ranking: 61 },
    "UZB": { name: "Uzbekistán", group: "K", titles: 0, titles: 0, ranking: 60 },
    "COL": { name: "Colombia", group: "K", titles: 0, ranking: 12 },
    
    "ENG": { name: "Inglaterra", group: "L", titles: 1, ranking: 4 },
    "CRO": { name: "Croacia", group: "L", titles: 0, ranking: 12 },
    "GHA": { name: "Ghana", group: "L", titles: 0, ranking: 64 },
    "PAN": { name: "Panamá", group: "L", titles: 0, ranking: 43 }
};

app.get('/api/teams', (req, res) => {
    const list = Object.keys(teamsDatabase).map(id => ({
        id: id,
        name: teamsDatabase[id].name
    })).sort((a, b) => a.name.localeCompare(b.name));
    res.json(list);
});

app.get('/api/fixture/:teamId', (req, res) => {
    const targetId = req.params.teamId.toUpperCase();
    const team = teamsDatabase[targetId];

    if (!team) return res.status(404).json({ error: "Selección no encontrada" });

    const rawMatches = fs.readFileSync('./fixture.json');
    const allMatches = JSON.parse(rawMatches);

    const teamMatches = allMatches.filter(m => m.home === targetId || m.away === targetId);

    const fixture = teamMatches.map(match => {
        const isHome = match.home === targetId;
        const opponentId = isHome ? match.away : match.home;
        const opponent = teamsDatabase[opponentId];

        const h2h = {
            jugados: 0,
            ganados: 0,
            empatados: 0,
            perdidos: 0
        };

        return {
            partido_numero: match.match_number,
            jornada: match.round,
            rival: opponent ? opponent.name : "Rival no definido",
            rival_ranking: opponent ? opponent.ranking : "??",
            fecha_art: match.fecha_txt,
            lugar: match.venue,
            historial: h2h
        };
    });

    res.json({
        seleccion: team.name,
        datos: { ranking_fifa: team.ranking, titulos_mundiales: team.titles, grupo: team.group },
        partidos: fixture
    });
});
const path = require('path');

// 1. Le dice a Express que la carpeta actual tiene archivos públicos (como el index.html)
app.use(express.static(path.join(__dirname, './')));

// 2. Le dice que cuando alguien entre a la raíz "/", le mande el archivo index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});
app.listen(PORT, () => {
    console.log(`Servidor Oficial Mundial 2026 en http://localhost:${PORT}`);
});
