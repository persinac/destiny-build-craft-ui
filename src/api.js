export const getModData = async () => {
    const response = await fetch(`${process.env.API_URL}/api/mods`,
        {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            }
        });
    return await response.json()
}

export const getModAttrData = async () => {
    const response = await fetch(`${process.env.API_URL}/api/mods/attributes`,
        {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            }
        })
    return await response.json()
}

export const postBuildData = async (listOfModIds, sameSubclass) => {
    const response = await fetch(`${process.env.API_URL}/api/build`,
        {
            method: "POST",
            body: JSON.stringify({"mod_ids": listOfModIds, "same_subclass": sameSubclass}),
            headers: {
                'Content-Type': 'application/json'
            }
        })
    return await response.json()
}
