(function () {

  console.log('Plugin Week Number started')

  class WeekNumberFunction {

    async execute(properties, listItem) {

      const property = properties[0]

      const value = await zySdk.services.dictionary.getValue(property.value, listItem)

      const date = new Date(value)

      // On bascule au jeudi de la semaine actuelle
      const target = new Date(date.valueOf())

      const dayNumber = (date.getUTCDay() + 6) % 7; // Lundi=0 ... Dimanche=6

      target.setUTCDate(target.getUTCDate() - dayNumber + 3)

      // On prend le 4 janvier de l'année (référence ISO)
      const firstThursday = new Date(Date.UTC(target.getUTCFullYear(), 0, 4))

      // Numéro ISO
      const weekNumber = 1 + Math.round(
        (target - firstThursday) / (7 * 24 * 3600 * 1000)
      )

      return weekNumber.toString()
    }
  }

  const IconData = ` 
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 1H8V3H16V1H18V3H19C20.11 3 21 3.9 21 5V19C21 20.11 20.11 21 19 21H5C3.89 21 3 20.1 3 19V5C3 3.89 3.89 3 5 3H6V1M5 8V19H19V8H5M7 10H17V12H7V10Z" />
    </svg>`

  const WeekNumberMetadata = {
    id: 'week-number',
    icon: IconData,
    label: 'Week Number',
    category: 'Plugins',
    format: 'number',
    properties: [{
      id: 'date',
      name: 'Date',
      type: 'date',
      default: '',
      main: true
    }],
    translations: [{
      lang: 'fr',
      label: 'Numéro de semaine',
      category: 'Plugins',
      properties: [
        { id: 'date', name: 'Date' }
      ]
    }]
  }

  zySdk.services.registry.registerFunction(WeekNumberMetadata, new WeekNumberFunction())

})();
