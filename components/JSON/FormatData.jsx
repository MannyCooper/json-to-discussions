import { useState, useEffect, useCallback, useContext } from 'react'
import { JSONContext } from '../../context/JSONContent'
import { Link } from 'next/link'
import { initJSON } from '../../context/JSONContent'
import eqSet from '../../lib/eqSet'

import { micromark } from 'micromark'
import { Tab } from '@headlessui/react'
import { Disclosure } from '@headlessui/react'

import { Switch } from '@headlessui/react'
import CommentTemplate from './CommentTemplate'

export default function FormatData() {
    const { jsonData, setJsonData } = useContext(JSONContext)
    const [classifiedData, setClassifiedData] = useState([])

    function handleBack() {
        setClassifiedData([])
        setJsonData({ ...jsonData, rawData: [] })
    }

    function commonDifferentProperties(properties, rawData) {
        const setData = JSON.parse(JSON.stringify(rawData)).map(item => new Set(Object.getOwnPropertyNames(item)))
        const firstType = setData[0]
        const types = [{ "type": firstType, "count": 0 }]
        setData.forEach(item => {
            let hasCommon = false
            types.forEach(type => {
                if (eqSet(type.type, item)) {
                    type.count += 1
                    hasCommon = true
                }
            })
            if (!hasCommon) {
                types.push({ "type": item, "count": 1 })
            }
        })

        function addRawData(types, rawData) {
            types.forEach(t => {
                t.data = []
                rawData.forEach(data => {
                    if (eqSet(t.type, new Set(Object.getOwnPropertyNames(data)))) {
                        t.data.push(data)
                    }
                })
            })
            return types
        }

        return addRawData(types, rawData)

    }

    const deconstruct = useCallback(() => {
        const { properties, rawData } = jsonData
        if (rawData.length > 0) {
            setClassifiedData(commonDifferentProperties(properties, rawData))
        } else {
            setClassifiedData([])
        }
    }, [jsonData])

    useEffect(() => {
        deconstruct()
    }, [deconstruct])

    console.log(jsonData)

    function handleNextStep() {
        // const filtered = data.map(item => Object.fromEntries(selectedProperty.map(k => [k, item[k]])))
        // // stringify then parse to remove undefined value
        // setJsonData({ properties: selectedProperty, rawData: JSON.parse(JSON.stringify(filtered)) })
    }

    function countFormattedComments(jsonData) {
        return jsonData.formattedData.map(item=>item.comments.length).reduce((a, b) => a+b, 0)
    }

    return (
        <div data-aos={jsonData.rawData.length > 0 ? 'fade-left' : 'hide'}>
            <div className="flex justify-between space-x-2">
                {/* <button className="btn btn-warning" onClick={handleBack} >Back</button> */}
                {/* <div className="flex form-control">                
                <input type="text" placeholder="username" className="input input-bordered input-primary" />
            </div> */}
            </div>
            {classifiedData.length > 0 &&
                <div className="my-6">
                    {classifiedData.map((item, index) =>
                        <CommentTemplate key={index} item={item} index={index} />
                    )}
                </div>}
                <div className="flex items-center justify-between mb-10">
                <button className="btn btn-error" onClick={handleBack} >Back</button>
                    <p className="text-lg"><span className="text-bold text-primary">{countFormattedComments(jsonData)}</span> comments will be submitted</p>
                <button className={`btn ${countFormattedComments(jsonData)?'btn-warning':'btn-disabled'}`} onClick={handleNextStep}>Next step</button>
                </div>
        </div>
    )
}