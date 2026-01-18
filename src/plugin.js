/**
 * Plugin Zyllio - Numéro de Semaine ISO 8601
 * Version finale corrigée avec listItem
 */

const PLUGIN_INFO = {
    name: "Fonctions Date Avancées",
    version: "4.0.0",
    author: "Hikaru-ufo",
    buildDate: "2025-01-20 18:30"
};

console.log('========================================');
console.log('CHARGEMENT PLUGIN ZYLLIO');
console.log(`Nom: ${PLUGIN_INFO.name}`);
console.log(`Version: ${PLUGIN_INFO.version}`);
console.log(`Auteur: ${PLUGIN_INFO.author}`);
console.log(`Build: ${PLUGIN_INFO.buildDate}`);
console.log('========================================');

const WeekIcon = `
<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
<path d="M19,3H18V1H16V3H8V1H6V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3M19,19H5V8H19V19Z" />
</svg>
`;

class WeekNumberFunction {
    async execute(properties, listItem) {  // AJOUT du paramètre listItem
        console.log('=== EXECUTION Numéro de semaine ===');
        
        try {
            const dateProperty = properties.find(p => p.id === 'date');
            
            if (!dateProperty || !dateProperty.value) {
                console.log('Pas de propriété date');
                return 0;
            }

            // CORRECTION: Passer listItem en second paramètre
            const dateString = await zySdk.services.dictionary.getValue(dateProperty.value, listItem);
            console.log('Date récupérée:', dateString);
            
            if (!dateString) {
                console.log('Aucune valeur de date');
                return 0;
            }

            const date = new Date(Date.parse(dateString));
            
            if (isNaN(date.getTime())) {
                console.log('Date invalide');
                return 0;
            }

            const weekNumber = this.getISOWeekNumber(date);
            console.log(`Semaine ${weekNumber} pour ${date.toISOString()}`);
            return weekNumber;

        } catch (error) {
            console.error('Erreur:', error);
            return 0;
        }
    }

    getISOWeekNumber(date) {
        const target = new Date(date.valueOf());
        const dayNr = (date.getDay() + 6) % 7;
        target.setDate(target.getDate() - dayNr + 3);
        const firstThursday = target.valueOf();
        target.setMonth(0, 1);
        if (target.getDay() !== 4) {
            target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
        }
        return 1 + Math.ceil((firstThursday - target.valueOf()) / 604800000);
    }
}

const WeekNumberMetadata = {
    id: 'week-number',
    icon: WeekIcon,
    label: 'Numéro de semaine',
    category: 'Date',
    format: 'number',
    properties: [{
        id: 'date',
        name: 'Date',
        type: 'date',
        tooltip: 'Sélectionnez la date pour obtenir son numéro de semaine (norme ISO 8601)',
        default: '',
        main: true
    }]
};

if (typeof zySdk !== 'undefined' && zySdk.services && zySdk.services.registry) {
    console.log('Enregistrement de la fonction...');
    const instance = new WeekNumberFunction();
    zySdk.services.registry.registerFunction(WeekNumberMetadata, instance);
    console.log(`Plugin ${PLUGIN_INFO.name} v${PLUGIN_INFO.version} chargé avec succès !`);
} else {
    console.error('zySdk indisponible');
}

if (typeof window !== 'undefined') {
    window.ZYLLIO_PLUGIN_INFO = PLUGIN_INFO;
}
