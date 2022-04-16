import { useState, useEffect, useCallback, useContext } from 'react'
import { JSONContext } from '../../context/JSONContent'
import { Link } from 'next/link'
import { initJSON } from '../../context/JSONContent'
import eqSet from '../../lib/eqSet'

import { micromark } from 'micromark'
import { Tab } from '@headlessui/react'
import { Disclosure, Switch, Transition } from '@headlessui/react'

export default function CommentTemplate(props) {

    const { item, index } = props
    const { jsonData, setJsonData } = useContext(JSONContext)
    const [comments, setComments] = useState([])
    const [id, setId] = useState("")
    const [pid, setPid] = useState("")
    const [date, setDate] = useState("")
    const [disName, setDisName] = useState("")
    const [disBody, setDisBody] = useState("")

    function classNames(...classes) {
        return classes.filter(Boolean).join(' ')
    }

    const [isChild, setIsChild] = useState(false)
    const [text, setText] = useState("")
    const [preview, setPreview] = useState("")
    const [isConfirm, setIsConfirm] = useState(false)

    String.prototype.interpolate = function (params) {
        const names = Object.keys(params);
        const vals = Object.values(params);
        return new Function(...names, `return \`${this}\`;`)(...vals);
    }

    function handleChange(e) {
        setText(e.target.value)
    }

    function handlePreview(e) {
        var handleText = text
        if (date.length > 0 && handleText.includes("${"+date+"}")){
            handleText = handleText.replaceAll("${"+date+"}",new Date(item.data[0][date]).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }))
        }
        item.type.forEach(i => {
            handleText = handleText.replaceAll("${" + i + "}", item.data[0][i])
        })
        setPreview(micromark(handleText, "utf8", { allowDangerousHtml: true }))
    }

    function handleSubmit() {
        var formattedData = []
        const count = 0

        function textToHTML(textData) {            
            return micromark(text.interpolate(textData), "utf8", { allowDangerousHtml: true })
        }
        
        item.data.forEach(data => {
            console.log(data)
            const formattedDate = new Date(data[date]).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
            data[date] = formattedDate
            formattedData.push({ id: data[id], comment: textToHTML(data), pid: isChild?data[pid]:"", disName: textToHTML(disName), disBody: textToHTML(disBody) })
        })

        var originalData = [...jsonData.formattedData]
        if (originalData.find(i => index === i.index)) {
            originalData.map(obj => obj.index === index ? obj.comments = formattedData : obj)
        } else {
            originalData.push({ index: index, comments: formattedData })
        }

        setJsonData({ ...jsonData, formattedData: originalData })
        setIsConfirm(true)
        console.log(jsonData)
    }

    function handleSelectID(e) {
        setId(e.target.value)
    }

    function handleSelectPID(e) {
        setPid(e.target.value)
    }

    function handleSelectDate(e) {
        setDate(e.target.value)
    }

    function handleDisName(e) {
        setDisName(e.target.value)
    }

    function handleDisBody(e) {
        setDisBody(e.target.value)
    }

    return (
        <div key={index} className="w-full">
            <Disclosure>
                {({ open }) => (
                    <>
                        <div className="flex flex-row justify-between w-full mt-4 mb-1 space-x-2 text-lg text-primary">
                            <div className="flex items-center space-x-2 ">
                                <p className="text-sm">#{index + 1}</p>
                                <p className="border-none bg-primary badge">{item.count}</p>
                                {
                                    isConfirm ? <p>✅</p> : ''
                                }
                            </div>
                        </div>

                        <Disclosure.Button className={`flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-left text-primary-focus bg-primary/10 hover:bg-primary/20 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75 ${open ? 'rounded-t-2xl' : 'rounded-2xl'}`}>
                            <div>
                                {
                                    Array.from(item.type).map(t =>
                                        <p className="my-1 mr-1 border-none bg-primary badge" key={t}>{t}</p>
                                    )
                                }
                            </div>

                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-8 h-8 text-primary transform rotate-180 ${open && "transform rotate-0"}`}><path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" /></svg>
                        </Disclosure.Button>
                        <Transition
                            show={open}
                            enter="transition duration-100 ease-out"
                            enterFrom="transform scale-95 opacity-0"
                            enterTo="transform scale-100 opacity-100"
                            leave="transition duration-75 ease-out"
                            leaveFrom="transform scale-100 opacity-100"
                            leaveTo="transform scale-95 opacity-0"
                        >
                            <Disclosure.Panel className={`flex flex-col items-center justify-center text-gray-500` + open ? 'bg-primary/5 p-4 pt-2 rounded-b-2xl' : ''}>
                                <div className="flex items-center justify-between mb-2 space-x-2 text-sm text-primary">
                                    <div>
                                        <p>The unique ID:</p>
                                        <select className="text-gray-500 max6w-xs w-25 select select-bordered select-xs" defaultValue={"DEFAULT"} onChange={handleSelectID}>
                                            <option disabled="disabled" value="DEFAULT">property</option>
                                            {
                                                Array.from(item.type).map(t =>
                                                    <option key={t}>{t}</option>
                                                )
                                            }
                                        </select>
                                    </div>
                                    <div>
                                        <p>Timestamp to date:</p>
                                        <select className="text-gray-500 max6w-xs w-25 select select-bordered select-xs" defaultValue={"DEFAULT"} onChange={handleSelectDate}>
                                            <option disabled="disabled" value="DEFAULT">(optional)</option>
                                            {
                                                Array.from(item.type).map(t =>
                                                    <option key={t}>{t}</option>
                                                )
                                            }
                                        </select>
                                    </div>
                                    <div >
                                        {isChild ? <p>Select the parent ID:</p> : <p>Is this a child comment?</p>}
                                        <div className="flex justify-between space-x-2">
                                            <Switch
                                                checked={isChild}
                                                onChange={setIsChild}
                                                className={`${isChild ? 'bg-green-500' : 'bg-gray-200'}
          relative inline-flex flex-shrink-0 h-[24px] w-[40px] border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
                                            >
                                                <span className="sr-only">Make Template</span>
                                                <span
                                                    aria-hidden="true"
                                                    className={`${isChild ? 'translate-x-4' : 'translate-x-0'}
            pointer-events-none inline-block h-[20px] w-[20px] rounded-full bg-white shadow-lg transform ring-0 transition ease-in-out duration-200`}
                                                />
                                            </Switch>
                                            {isChild &&
                                                <select className="max-w-xs text-gray-500 w-26 select select-bordered select-xs" >
                                                    <option disabled="disabled" value="DEFAULT">property</option>
                                                    {
                                                        Array.from(item.type).map(t =>
                                                            <option key={t}>{t}</option>
                                                        )
                                                    }
                                                </select>
                                            }
                                        </div>
                                    </div>
                                </div>
                                <Tab.Group onChange={handlePreview}>
                                    <div className="flex justify-between w-full">
                                        <label className="p-0 label">
                                            <span className="text-purple-700 label-text">Your template (Markdown/HTML)</span>
                                        </label>
                                        <Tab.List className="flex w-40 p-1 space-x-1 bg-primary/50 rounded-xl">
                                            <Tab className={({ selected }) =>
                                                classNames(
                                                    'w-full text-sm leading-4 font-medium rounded-lg',
                                                    'focus:outline-none focus:ring-2 ring-offset-2 text-white ring-offset-purple-400 ring-white ring-opacity-60',
                                                    selected
                                                        ? 'text-purple-700 bg-white shadow'
                                                        : 'hover:bg-white/[0.12] hover:text-white'
                                                )
                                            }>Plain</Tab>
                                            <Tab className={({ selected }) =>
                                                classNames(
                                                    'w-full text-sm leading-4 font-medium rounded-lg',
                                                    'focus:outline-none focus:ring-2 ring-offset-2 text-white ring-offset-purple-400 ring-white ring-opacity-60',
                                                    selected
                                                        ? 'text-purple-700 bg-white shadow'
                                                        : 'hover:bg-white/[0.12] hover:text-white'
                                                )
                                            } >Preview</Tab>
                                        </Tab.List>
                                    </div>
                                    <Tab.Panels className="w-full">
                                        <Tab.Panel>
                                            <div className="w-full form-control">
                                                <textarea className={`h-32 leading-4 textarea border-2 border-purple-900/20 mt-2 rounded-2xl`} placeholder="Use the format like ${comment} to represent the data.&#10;To generate a table, you can use https://www.tablesgenerator.com/html_tables" defaultValue={text} onChange={handleChange} />
                                            </div>
                                        </Tab.Panel>
                                        <Tab.Panel>
                                            <div className="h-32 mt-2 overflow-auto leading-4 border-2 textarea border-purple-900/20 rounded-2xl"
                                                dangerouslySetInnerHTML={{ __html: preview }}>
                                            </div>
                                        </Tab.Panel>
                                    </Tab.Panels>
                                </Tab.Group>
                                <div className="flex items-end justify-between space-x-4 text-sm leading-6 text-primary">
                                    <div className="flex space-x-2">
                                        <div>
                                            <p>Discussion Name:</p>
                                            <input type="text" placeholder="such as ${url}..." className="w-32 input input-sm input-bordered" onChange={handleDisName}/>
                                        </div>
                                        <div>
                                            <p>Discussion Body:</p>
                                            <input type="text" placeholder="such as ${href}..." className="w-32 input input-sm input-bordered" onChange={handleDisBody}/>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                    {
                                        isConfirm ? <p>✅</p> : ''
                                    }
                                    <button className="btn btn-sm btn-success" onClick={handleSubmit}>Confirm</button>
                                    </div>
                                </div>
                            </Disclosure.Panel>
                        </Transition>
                    </>
                )}
            </Disclosure>
        </div>
    )

}