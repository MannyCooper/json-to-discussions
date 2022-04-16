import { createContext } from 'react'

export const initJSON = {
    properties: [],
    rawData: [],
    formattedData: [],
    // formattedData: [{ index: "", count: 0, comments: [{ id: "", comment: "", pid: "", disName: "", disBody: "" }] }],
}

export const JSONContext = createContext(initJSON)