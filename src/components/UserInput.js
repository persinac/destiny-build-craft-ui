import React, {useEffect, useState} from "react";
import ButtonComponent from "./General/Button";
import { AppContext } from '../stupidContext';
import ArmorBuilder from "./Grid/ArmorBuilder";
import {getModData, getModAttrData, postBuildData} from "../api"
import {Button, Card, Checkbox, Container, Divider, Icon} from "semantic-ui-react";

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
    const [well_impact_data, setWellImpactData] = useState([]);
    const [cwl_impact_data, setCWLImpactData] = useState([]);
    const [warmind_impact_data, setWarmindImpactData] = useState([]);
    const [same_subclass, setSameSubclass] = useState(0);

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

    const translateSymbolAndImpact = (symbolText, value) => {
        switch (symbolText) {
            case "percentage":
                return `${value}%`;
            case "addition":
                return `+${value}`;
            case "subtraction":
                return `-${value}`;
            default:
                return `&&${value}`;
        }
    }

    const CardExampleExtraContent = () => (
        <Card>
            <Card.Content header='Wells' />
            <Card.Content>
                {outputWellImpact()}
            </Card.Content>
            <Card.Content extra>
                <Icon name='hand rock' />{well_impact_data.length} mods
            </Card.Content>
        </Card>
    )

    const CardCWLContent = () => (
        <Card>
            <Card.Content header='Charged with Light' />
            <Card.Content>
                {outputCWLImpact()}
            </Card.Content>
            <Card.Content extra>
                <Icon name='bullseye' />{cwl_impact_data.length} mods
            </Card.Content>
        </Card>
    )

    const CardWarmindContent = () => (
        <Card>
            <Card.Content header='Warmind Cells' />
            <Card.Content> TBD </Card.Content>
            <Card.Content extra>
                <Icon name='thumbs down' />{warmind_impact_data.length} mods
            </Card.Content>
        </Card>
    )

    const outputWellImpact = () => {
        if (!!well_impact_data && well_impact_data.length > 0) {
            return well_impact_data.map((ts, i) => {
                return (
                    <p>{ts['impact']} {translateSymbolAndImpact(ts['value_modifier'], ts['curr_value'])}</p>
                )
            });
        }
    }

    const outputCWLImpact = () => {
        if (!!cwl_impact_data && cwl_impact_data.length > 0) {
            return cwl_impact_data.map((ts, i) => {
                // nested impacts
                return ts['impact'].map((impact, i) => {
                    if (impact['notes']) {
                        return (
                            <p>
                                {impact['impact']} {translateSymbolAndImpact(impact['value_modifier'], impact['curr_value'])}
                            <br/><i>Note: {impact['notes']}</i>
                            </p>
                        )
                    }
                    return (
                        <p>{impact['impact']} {translateSymbolAndImpact(impact['value_modifier'], impact['curr_value'])}</p>
                    )
                })
            });
        }
    }

    const postBuildDataLocal = () => {
        const listOfIds = helmBuildData.concat(arms_build_data, chest_build_data, legs_build_data, class_build_data)
        postBuildData(listOfIds, same_subclass)
            .then((data) => {
                setWellImpactData(data['data']['wells'])
                setCWLImpactData(data['data']['cwl'])
            })
    }

    return (
        <Container>
            <div className="d-flex flex-row justify-content-center">
                <h2>Armor Mod Selection</h2>
            </div>
            <div>
                <AppContext.Provider value={{ valueOptions, setBuildData2 }}>
                    <ArmorBuilder armorPiece={'helm'} armorBuildData={helmBuildData}/>
                    <ArmorBuilder armorPiece={'arms'} armorBuildData={arms_build_data}/>
                    <ArmorBuilder armorPiece={'chest'} armorBuildData={chest_build_data}/>
                    <ArmorBuilder armorPiece={'legs'} armorBuildData={legs_build_data}/>
                    <ArmorBuilder armorPiece={'class'} armorBuildData={class_build_data}/>
                </AppContext.Provider>
            </div>
            <div className="d-flex flex-row justify-content-left">
                <h2>Options</h2>
            </div>
            <div>
                <Checkbox
                    className="left floated"
                    label='Assume same subclass'
                    toggle
                    onChange={(e, data) => setSameSubclass(data.checked)}
                    checked={same_subclass}
                />
                <Button
                    className="right floated"
                    primary
                    content={"Submit"}
                    onClick={postBuildDataLocal}
                />

            </div>
            <Divider horizontal>Impact</Divider>
            <Card.Group>
                <CardExampleExtraContent />
                <CardCWLContent />
                <CardWarmindContent />
            </Card.Group>
        </Container>
    )
}



export default UserInput;