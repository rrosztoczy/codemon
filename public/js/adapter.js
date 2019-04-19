

const adapter = (url) => {
    // const headers = {
    //     'Content-Type': 'application/json',
    //     'Accept': 'application/json'
    //   }

    const getAll = async () => {
        const resp = await fetch(url)
        const jsonMonsters = await resp.json()
        return jsonMonsters
    }

    const getOne = async (id) => {
        const resp = await fetch(url + "/:" + id)
        const jsonMonster = await resp.json()
        return jsonMonster
    }


    return {
        getAll,
        getOne
    }
}
