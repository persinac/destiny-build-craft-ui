import React, {useEffect, useState} from "react";
import ButtonComponent from "./General/Button";
import { AppContext } from '../stupidContext';
import ArmorBuilder from "./Grid/ArmorBuilder";
import {getModData, getModAttrData, postBuildData} from "../api"

/*****
 * How could we make the input easier to use? Make is a self contained function with its own state
 * function useInput({type ... }) { const [...] = useState(""); const input = <input ...> return [value, input]}
* */
const UserInput = () => {
    // the key with this type of setup is that we need a line & f(x) for each input
    const [modList, setModList] = useState([]);
    const [modAttrList, setModAttrList] = useState([]);
    const [valueOptions, setValueOptions] = useState([]);
    const [helmBuildData, setHelmBuildData] = useState([]);
    const [arms_build_data, setArmsBuildData] = useState([]);
    const [chest_build_data, setChestBuildData] = useState([]);
    const [legs_build_data, setLegsBuildData] = useState([]);
    const [class_build_data, setClassBuildData] = useState([]);
    const [raw_build_data, setRawBuildData] = useState([]);

    useEffect(() => {
        getModData().then((data) => {setModList(data['data'])})
        getModAttrData().then((data) => {setModAttrList(data['data'])})
    }, [])

    useEffect(() => {
        parseValueOptionsForDropdown()
    }, [modList, modAttrList])

    const parseValueOptionsForDropdown = () => {
        const listOfObjs = []
        modList.forEach((val, idx) => {
            listOfObjs.push({ key: val['id'], value: val['id'], text: val['name'] })
        })
        setValueOptions(listOfObjs)
    }

    const setBuildData2 = (event, {value, piece, idx}) => {
        switch (piece) {
            case 'helm':
                setHelmBuildData(existingItems => {
                    existingItems[idx] = value
                    return [...existingItems]
                })
                break;
            case 'arms':
                setArmsBuildData(existingItems => {
                    existingItems[idx] = value
                    return [...existingItems]
                })
                break;
            case 'chest':
                setChestBuildData(existingItems => {
                    existingItems[idx] = value
                    return [...existingItems]
                })
                break;
            case 'legs':
                setLegsBuildData(existingItems => {
                    existingItems[idx] = value
                    return [...existingItems]
                })
                break;
            case 'class':
                setClassBuildData(existingItems => {
                    existingItems[idx] = value
                    return [...existingItems]
                })
                break;
        }
    }

    const translateSymbol = (symbolText) => {
        switch (symbolText) {
            case "percentage":
                return "%";
            case "addition":
                return "+";
            case "subtraction":
                return "-";
            default:
                return "&&";
        }
    }

    const outputRawAsStuff = () => {
        if (!!raw_build_data && raw_build_data.length > 0) {
            return raw_build_data.map((ts, i) => {
                return (
                    <p>{ts['impact']} {translateSymbol(ts['value_modifier'])}{ts['curr_value']}</p>
                )
            });
        }
    }

    const postBuildDataLocal = () => {
        const listOfIds = helmBuildData.concat(arms_build_data, chest_build_data, legs_build_data, class_build_data)
        console.log(listOfIds)
        postBuildData(listOfIds)
            .then((data) => {
                setRawBuildData(data['data'])
            })
    }

    return (
        <div>
            <div className="d-flex flex-row justify-content-center">
                <h2>Inputs</h2>
            </div>
            <div>
                <AppContext.Provider value={{ valueOptions, setBuildData2 }}>
                    <ArmorBuilder armorPiece={'helm'} armorBuildData={helmBuildData}/>
                    <ArmorBuilder armorPiece={'arms'} armorBuildData={arms_build_data}/>
                    <ArmorBuilder armorPiece={'chest'} armorBuildData={chest_build_data}/>
                    <ArmorBuilder armorPiece={'legs'} armorBuildData={legs_build_data}/>
                    <ArmorBuilder armorPiece={'class'} armorBuildData={class_build_data}/>
                </AppContext.Provider>


                <ButtonComponent onClickFunction={postBuildDataLocal} label={"Submit"}/>
            </div>
            <div>
                {outputRawAsStuff()}
            </div>
        </div>
    )
}



export default UserInput;