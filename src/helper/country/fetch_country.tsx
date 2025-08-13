import axios from "axios"

interface Languages{
    name: string
}

interface Country{
    name: string,
    capital: string,
    code: string,
    currency: string,
    emoji: string,
    languages: Languages[],
}


const fetchCountries = async (filterValue : string) : Promise<Country[]> => {

    const filter : string =  filterValue ? 
    `filter: {
        OR: [
            {name : {eq : "${filterValue}"}}
            {currency : {eq : "${filterValue}"}}
        ]
    }`: ""

    const query : string = `
        query {
            countries(${filter}
              ){
              code
              name
              capital
              emoji
              languages {
                name
              }
              currency
            }
          }
        `

    try {
        
        const response = await axios.post(
            "https://countries.trevorblades.com/", 
            {query}, 
            {
                headers : {
                    "Content-Type": "application/json",

                },
            }
            )

        return response.data.data.countries ?? []

    } catch (error) {
        console.log(error)
        return []
    }
}

export default fetchCountries