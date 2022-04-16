import { useFilePicker } from 'use-file-picker';
import { useState, useEffect, useContext } from 'react'
import eqSet from '../../lib/eqSet'
import { JSONContext } from '../../context/JSONContent'

export default function FilePicker() {
  const { jsonData, setJsonData } = useContext(JSONContext)

  const [openFileSelector, { filesContent, loading }] = useFilePicker({
    multiple: false,
    accept: '.json',
  });

  const [data, setData] = useState([])
  const [selectedProperty, setSelectedProperty] = useState([])

  useEffect(() => {
    function parseJSON(data) {
      let parsedData = []
      try {
        parsedData = JSON.parse(data)
      } catch (error) {
        try {
          // for ndjson (Line Separator is '\n' instead of comma)
          parsedData = data.split('\n').filter(i => i).map(item => JSON.parse(item))
        } catch (error) {
          alert(error)
        }
      }
      setData(parsedData)
    }
    if (filesContent.length > 0) {
      parseJSON(filesContent[0].content)
    }
  }, [filesContent,loading])

  useEffect(() => {

  }, [selectedProperty, jsonData])

  function showProperties(data) {
    let set = new Set()
    data.forEach(item => {
      Object.getOwnPropertyNames(item).forEach(prop => set.add(prop))
    })
    return Array.from(set)
  }

  function handleClick(e) {
    const target = e.target.textContent
    if (selectedProperty.includes(target)) {
      setSelectedProperty(selectedProperty.filter(prop => prop !== target))
    } else {
      setSelectedProperty([...selectedProperty, target])
    }
  }

  function handleNextStep() {
    const filtered = data.map(item => Object.fromEntries(selectedProperty.map(k => [k, item[k]])))
    // stringify then parse to remove undefined value
    setJsonData({...jsonData, properties: selectedProperty, rawData: JSON.parse(JSON.stringify(filtered)) })
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (

    <div className="flex flex-col items-center justify-center" data-aos={jsonData.rawData.length > 0 ? `hide` : 'fade-right'}>
      <button className="btn btn-primary" onClick={() => openFileSelector()}>Select files </button>
      {data.length !== 0 &&
        <div className="my-4 font-semibold text-center" data-aos="fade-right">
          <p>
            <span>The json has
              <span className="text-primary"> {data.length} </span>
              pieces of data</span>
          </p>
          <p>...and you got
            <span className="text-primary"> {showProperties(data).length} </span>
            properties in total👇</p>

          <div className="flex flex-wrap max-w-lg my-4" data-aos="fade-up">
            {
              showProperties(data).map(prop =>

                <p key={prop} className={`normal-case kbd btn hover:text-white hover:bg-warning hover:border-white mr-2 mb-2 ${selectedProperty.includes(prop) ? 'bg-warning text-white border-white' : 'text-gray-500'}`}
                  onClick={handleClick}
                >
                  {prop}
                </p>
              )
            }
          </div>
          <p>Please click to select <span className="text-warning">only</span> what you need</p>
          {selectedProperty.length > 0 &&
            <div data-aos="fade-up">
              <div className="flex items-center max-w-lg p-4 my-6 overflow-auto border-2 border-solid shadow-lg rounded-3xl border-primary">
                {
                  selectedProperty.map(prop =>
                    <p className="mr-2 badge badge-primary badge-outline" key={prop}>{prop}</p>
                  )}
              </div>
              <span>...after the decision, click 👉 </span>
              <button className="btn btn-warning" onClick={handleNextStep}>Next step</button>
            </div>
          }
        </div>
      }
      {/* {data.map(d=>Object.getOwnPropertyNames(d))} */}
      {/* {JSON.stringify(data)} */}
      {/* {filesContent.map((file, index) => (
        <div key={index}>
          <h2>{file.name}</h2>
          <div key={index}>{file.content}</div>
          <br />
        </div>
      ))} */}
    </div >
  )
}