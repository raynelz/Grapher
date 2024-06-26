import React, { useState, useEffect, useRef } from 'react';
import Plot from 'react-plotly.js';
import MathKeyboard from './MathKeyboard.js';
import { createSmartappDebugger, createAssistant } from '@salutejs/client';
import 'normalize.css';
import './styles.css';
import './index.css';
import './voice.css';
import './MathKeyboard.css';
import { ButtonGroup, Button } from "@mui/material";
//import ZoomControls from './ZoomControls.js';
import { make_function } from './math_parser.js';
import { useSpatnavInitialization, useSection, getCurrentFocusedElement } from '@salutejs/spatial';
const App = () => {
    const [functions, setFunctions] = useState([]);
    const [functionInput, setFunctionInput] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [xRange, setXRange] = useState([-100, 100]);
    const [yRange, setYRange] = useState([-100, 100]);
    const [isFunctionListVisible, setIsFunctionListVisible] = useState(false);
    const [hiddenFunctions, setHiddenFunctions] = useState([]);
    const [isKeyboardExpanded, setIsKeyboardExpanded] = useState(true);
    const [isHelpVisible, setIsHelpVisible] = useState(false); // State for help visibility
    const inputRef = useRef(null);
    const assistantRef = useRef(null);
    const addButtonRef = useRef(null);
    const functionListRef = useRef(null);
    const functionRefs = useRef([]);
    const colorRefs = useRef([]);
    const removeButtonRefs = useRef([]);
    const closeButtonRef = useRef(null);
    const zoomControlsRef = useRef(null);
    const buttonRefs = useRef([]);

    // Initialize buttonRefs
    useEffect(() => {
        buttonRefs.current = Array(37).fill(null).map((_, i) => buttonRefs.current[i] || React.createRef());
    }, []);

    const [plotLayout, setPlotLayout] = useState({
        autosize: true,
        margin: {t: 50, r: 50, b: 50, l: 50},
        xaxis: {
            zeroline: true,
            zerolinecolor: '#000',
            range: [-20, 20], // Set the initial range for x-axis
        },
        yaxis: {
            zeroline: true,
            zerolinecolor: '#000',
            range: [-50, 50], // Set the initial range for y-axis
        },
    });

    useEffect(() => {
        const handleResize = () => {
            setPlotLayout((prevLayout) => ({
                ...prevLayout,
                width: window.innerWidth * 0.67, // Примерное значение ширины графика
                height: window.innerHeight * 0.67, // Примерное значение высоты графика
            }));
        };

        handleResize();

        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);


    const handleZoomInX = () => {
        setPlotLayout(prevLayout => ({
            ...prevLayout,
            xaxis: {
                ...prevLayout.xaxis,
                range: [prevLayout.xaxis.range[0] * 0.8, prevLayout.xaxis.range[1] * 0.8]
            }
        }));
    };

    const handleZoomOutX = () => {
        setPlotLayout(prevLayout => ({
            ...prevLayout,
            xaxis: {
                ...prevLayout.xaxis,
                range: [prevLayout.xaxis.range[0] / 0.8, prevLayout.xaxis.range[1] / 0.8]
            }
        }));
    };

    const handleZoomInY = () => {
        setPlotLayout(prevLayout => ({
            ...prevLayout,
            yaxis: {
                ...prevLayout.yaxis,
                range: [prevLayout.yaxis.range[0] * 0.8, prevLayout.yaxis.range[1] * 0.8]
            }
        }));
    };

    const handleZoomOutY = () => {
        setPlotLayout(prevLayout => ({
            ...prevLayout,
            yaxis: {
                ...prevLayout.yaxis,
                range: [prevLayout.yaxis.range[0] / 0.8, prevLayout.yaxis.range[1] / 0.8]
            }
        }));
    };

    const handleResetZoom = () => {
        setPlotLayout((prevLayout) => ({
            ...prevLayout,
            xaxis: {
                ...prevLayout.xaxis,
                range: [-20, 20], // Reset x-axis range
            },
            yaxis: {
                ...prevLayout.yaxis,
                range: [-50, 50], // Reset y-axis range
            },
        }));
    };

    // const initializeAssistant = (getState) => {
    //     if (process.env.NODE_ENV === 'development') {
    //         return createSmartappDebugger({
    //             token: process.env.REACT_APP_TOKEN ?? '',
    //             initPhrase: `Запусти ${process.env.REACT_APP_SMARTAPP}`,
    //             getState,
    //         });
    //     }
    //     return createAssistant({ getState });
    // };
    //
    // useEffect(() => {
    //     window.addMathFunction = (func, context) => {
    //         setFunctionInput(prev => prev + func);
    //     };
    //     const getState = () => ({ functions });
    //     const assistant = initializeAssistant(getState);
    //     assistant.on('data', handleAssistantData);
    // }, [functions]);

    useEffect(() => {
        if (isKeyboardExpanded && functionListRef.current) {
            functionListRef.current.focus();
        }
    }, [isKeyboardExpanded]);

    useEffect(() => {
        if (isHelpVisible && closeButtonRef.current) {
            closeButtonRef.current.focus();
        }
    }, [isHelpVisible]);

    const handleAssistantData = (event) => {
        console.log('handleAssistantData:', event);
        const { action } = event;

        if (action && action.parameters) {
            if (action.parameters.function) {
                const func = action.parameters.function;
                window.addMathFunction(func);
            }
        } else {
            console.error('Action parameters or function is undefined:', action);
        }
    };

   const handleInputKeyDown = (e) => {
        if (e.key === 'Enter') {
           e.preventDefault();
           buttonRefs?.current[0].focus();
       } else if (e.key === 'ArrowDown') {
           if (functions.length > 0) {
               functionRefs.current[0].focus();
           }
       } else if (e.key === 'ArrowRight') {
           buttonRefs?.current[0].focus();
       }
   };

   const handleAddFunctionKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleAddFunction();
        } else if (e.key === 'ArrowDown' && functionRefs.current.length > 0) {
            functionRefs.current[0].focus();
        } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
            inputRef.current.focus();
        } else if (e.key === 'ArrowRight') {
            if (buttonRefs?.current[1].current) {
                buttonRefs?.current[1].current.focus();
            } else if (zoomControlsRef.current) {
                zoomControlsRef.current.focus();
            } else if (addButtonRef.current) {
                buttonRefs?.current[0].focus();
            }
        }
    };

    const handleFunctionEdit = (index, editedFunction) => {
        setFunctions((prevFunctions) => {
            const updatedFunctions = [...prevFunctions];
            updatedFunctions[index] = editedFunction;
            return updatedFunctions;
        });
    };

    const handleFunctionInputChange = (e) => {
        setFunctionInput(e.target.value);
    };

    const handleAddFunction = () => {
        if (functionInput.trim() !== '') {
            setFunctionInput(prevFunctionInput => prevFunctionInput + functionInput.trim());
            setFunctions([...functions, {func: functionInput, color: getRandomColor()}]);
            setFunctionInput('');
            setIsFunctionListVisible(true);
            setErrorMessage('');
        } else {
            setErrorMessage('Введите функцию.');
        }
    };

    const handleFunctionRemove = (index) => {
        setFunctions((prevFunctions) => prevFunctions.filter((_, i) => i !== index));
    };

    const FunctionList = ({functions, hiddenFunctions}) => (
        <div
            ref={functionListRef}
            style={{marginTop: '10px'}}
            tabIndex={-1}
        >
            <div
                style={{
                    backgroundColor: '#fff',
                    border: '1px solid #ddd',
                    borderRadius: '5px',
                    padding: '10px',
                    width: 'auto%',
                    maxHeight: '200px',
                    overflowY: 'auto',
                }}
            >
                {functions.map((func, index) => (
                    <div
                        key={index}
                        tabIndex={1}
                        ref={el => functionRefs.current[index] = el}
                        className="focusable"
                        style={{padding: '5px', display: 'flex', alignItems: 'center', cursor: 'pointer'}}
                        onKeyDown={(e) => handleFunctionKeyDown(e, index)}
                    >
                        <div
                            ref={(el) => colorRefs.current[index] = el}
                            style={{
                                width: '20px',
                                height: '20px',
                                borderRadius: '50%',
                                backgroundColor: func.color,
                                marginRight: '5px',
                                cursor: 'pointer',
                                border: '1px solid #ddd',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                            tabIndex={1}
                            onClick={() => handleFunctionToggle(index)}
                            onKeyDown={(e) => handleColorKeyDown(e, index)}
                        >
                            {hiddenFunctions.includes(index) && (
                                <span style={{color: '#ddd', fontSize: '12px'}}>•</span>
                            )}
                        </div>
                        <span
                            style={{
                                flex: 1,
                                fontStyle: hiddenFunctions.includes(index) ? 'italic' : 'normal',
                                textDecoration: hiddenFunctions.includes(index) ? 'line-through' : 'none',
                            }}
                            contentEditable={!hiddenFunctions.includes(index)}
                            suppressContentEditableWarning={true}
                            onBlur={(e) =>
                                handleFunctionEdit(index, {...func, func: e.target.textContent})
                            }
                        >
                            {func.func}
                        </span>
                        <button
                            ref={(el) => removeButtonRefs.current[index] = el}
                            onClick={() => handleFunctionRemove(index)}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: 'red',
                                cursor: 'pointer',
                                fontSize: '16px',
                                marginLeft: '5px',
                            }}
                            tabIndex={1}
                            onKeyDown={(e) => handleRemoveButtonKeyDown(e, index)}
                        >
                            ✖
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );

    const handleFunctionKeyDown = (e, index) => {
        console.log(e);
        if (e.key === 'ArrowDown' && index < functions.length - 1) {
            e.preventDefault();
            colorRefs.current[index + 1].focus();
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (index > 0) {
                colorRefs.current[index - 1].focus();
            } else {
                inputRef.current.focus();
            }
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            removeButtonRefs.current[index].focus();
        }
    };
    
    const handleColorKeyDown = (e, index) => {
        if (e.key === 'ArrowRight') {
            e.preventDefault();
            removeButtonRefs.current[index].focus();
        } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            functionRefs.current[index].focus();
        } else if (e.key === 'ArrowDown' && index < colorRefs.current.length - 1) {
            e.preventDefault();
            colorRefs.current[index + 1].focus();
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (index > 0) {
                colorRefs.current[index - 1].focus();
            } else {
                inputRef.current.focus(); // Устанавливаем фокус на поле ввода
            }
        } else if (e.key === 'Enter') {
            e.preventDefault();
            inputRef.current.focus(); // Устанавливаем фокус на поле ввода
            setHiddenFunctions((prevHiddenFunctions) => {
                if (prevHiddenFunctions.includes(index)) {
                    return prevHiddenFunctions.filter((i) => i !== index);
                } else {
                    return [...prevHiddenFunctions, index];
                }
            });
        }
    };
    
    const handleRemoveButtonKeyDown = (e, index) => {
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            colorRefs.current[index].focus();
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            functionRefs.current[index].focus();
        } else if (e.key === 'ArrowDown' && index < functions.length - 1) {
            e.preventDefault();
            colorRefs.current[index + 1].focus();
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (index > 0) {
                colorRefs.current[index - 1].focus();
            } else {
                inputRef.current.focus();
            }
        } else if (e.key === 'Enter') {
            e.preventDefault();
            setFunctions((prevFunctions) => {
                const updatedFunctions = prevFunctions.filter((_, i) => i !== index);
                if (index === 0) {
                    // If deleting the first function, set focus to inputRef.current
                    inputRef.current.focus();
                } else if (index === functions.length - 1) {
                    // If deleting the last function, set focus to the previous color button
                    colorRefs.current[index - 1].focus();
                } else {
                    // Otherwise, set focus to the next color button after deletion
                    colorRefs.current[index].focus();
                }
                return updatedFunctions;
            });
        }
    };

    const handleFunctionToggle = (index) => {
        setHiddenFunctions((prevHiddenFunctions) => {
            if (prevHiddenFunctions.includes(index)) {
                return prevHiddenFunctions.filter((i) => i !== index);
            } else {
                return [...prevHiddenFunctions, index];
            }
        });
    };

    const handleRelayout = (event) => {
        if (event['xaxis.range[0]'] && event['xaxis.range[1]']) {
            setXRange([event['xaxis.range[0]'], event['xaxis.range[1]']]);
        }
        if (event['yaxis.range[0]'] && event['yaxis.range[1]']) {
            setYRange([event['yaxis.range[0]'], event['yaxis.range[1]']]);
        }
    };

    // const openHelpModal = () => {
    //     setIsHelpVisible(true);
    //     setTimeout(() => {
    //         if (closeButtonRef.current) {
    //             closeButtonRef.current.focus();
    //         }
    //     }, 0);
    // };

    // const closeHelpModal = () => {
    //     setIsHelpVisible(false);
    //     if (buttonRefs?.current[1].current) {
    //         buttonRefs?.current[1].current.focus();
    //     }
    // };

    const toggleHelpModal = (isOpen) => {
        setIsHelpVisible(isOpen);

        setTimeout(() => {
            if (isOpen && closeButtonRef.current) {
                closeButtonRef.current.focus();
            } else if (!isOpen) {
                if (buttonRefs?.current[1].current) {
                    buttonRefs?.current[1].current.focus();
                }
            }
        }, 0);
    };
    // Example usage
    const openHelp = () => toggleHelpModal(true);
    const closeHelp = () => toggleHelpModal(false);

    const handleHelpButtonKeyDown = (e) => {
        if (e.key === 'ArrowRight') {
            e.preventDefault();
            if (zoomControlsRef.current) {
                const buttons = zoomControlsRef.current.querySelectorAll("button");
                if (buttons.length > 0) {
                    buttons[0].focus(); // Устанавливаем фокус на первую кнопку в контейнере
                }
            }
        }
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            buttonRefs?.current[0].focus();
        }
    }

const generatePlotData = () => {
    return functions.map(({func, color}, index) => {
        if (hiddenFunctions.includes(index)) {
            return null;  // Если функция скрыта, возвращаем null
        }

        let f;
        try {
            f = make_function(func);
        } catch (error) {
            setErrorMessage(`Ошибка в функции: ${func}`);
            return null;
        }

        const xValues = [];
        const yValues = [];
        const step = (xRange[1] - xRange[0]) / 1000;

        for (let x = xRange[0]; x <= xRange[1]; x += step) {
            try {
                const y = f(x);
                xValues.push(x);
                yValues.push(y);
            } catch (error) {
                setErrorMessage(`Ошибка вычисления функции: ${func}`);
            }
        }

        return {
            x: xValues,
            y: yValues,
            type: 'scatter',
            mode: 'lines',
            marker: {color},
            name: func
        };
    }).filter(data => data !== null);  // Исключаем null значения из возвращаемого массива
};

    const isTouchDevice = () => {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
    };

    const isSmartTV = () => {
        return /TV|SmartTV|AppleTV|GoogleTV|HbbTV|NetCast.TV/i.test(navigator.userAgent);
    };

    const handleTouchStart = (e) => {
        if (isTouchDevice() || isSmartTV()) {
            e.preventDefault(); // Prevent default touch event to avoid showing system keyboard
        }
    };

    const handleKeyZoom = (e) => {
        const buttons = zoomControlsRef.current.querySelectorAll("button");
        const currentButtonIndex = Array.from(buttons).findIndex(button => button === document.activeElement);
        switch (e.key) {
          case "ArrowLeft":
            if (currentButtonIndex > 0) {
              buttons[currentButtonIndex - 1].focus();
            } else {
              // Если текущий элемент - первая кнопка, фокусируемся на кнопке помощи
              if (buttonRefs?.current[1].current) {
                buttonRefs?.current[1].current.focus();
              }
            }
            break;
          case "ArrowRight":
            if (currentButtonIndex < buttons.length - 1) {
              buttons[currentButtonIndex + 1].focus();
            }
            break;
          default:
            break;
        }
      };

    return (
        <div style={{display: 'flex', height: '100vh'}}>
            <div className="app-container"
                 style={{flex: '1', height: 'auto', borderRight: '1px solid #ccc', flexDirection: 'column'}}>
                <div className="input-panel" style={{display: 'flex', alignItems: 'center'}}>
                    <input
                        tabIndex={30}
                        ref={inputRef}
                        type="text"
                        placeholder="5*x + 1"
                        value={functionInput}
                        onChange={handleFunctionInputChange}
                        onKeyDown={handleInputKeyDown}
                        onTouchStart={handleTouchStart}  // Prevent default touch event to avoid showing system keyboard
                        style={{padding: '10px', width: '150%', margin: '0', border: '1px solid black'}}
                    />
                    <button
                        tabIndex={31}
                        ref={buttonRefs?.current[31]}
                        className="focusable"
                        onClick={handleAddFunction}
                        onKeyDown={handleAddFunctionKeyDown}
                        style={{
                            width: '30%',
                            padding: '10px',
                            backgroundColor: '#1a73e8',
                            color: '#fff',
                            margin: '0',
                        }}
                    >
                        +
                    </button>
                </div>
            {isFunctionListVisible && (
                <FunctionList functions={functions} hiddenFunctions={hiddenFunctions}/>
            )}
        </div>
    <div style={{padding: '3px', position: 'relative', top: '1px', zIndex: '2'}}>
    <span onClick={openHelp} style={{cursor: 'pointer'}}>
        <button
            tabIndex={32}
            ref={buttonRefs?.current[32]}
            style={{
                width: '30px',
                height: '30px',
                backgroundColor: '#1a73e8',
                color: '#fff',
                border: 'none',
                borderRadius: '50%',
                fontSize: '20px',
            }}
            onKeyDown={handleHelpButtonKeyDown}
        >
            ?
        </button>
    </span>
        {/* Модальное окно справки */}
        {isHelpVisible && (
            <div
                className="help-modal"
                style={{
                    position: 'fixed',
                    top: '35%',
                    left: '20%',
                    transform: 'translateY(-50%)',
                    backgroundColor: '#e6f1fa',
                    padding: '10px',
                    borderRadius: '8px',
                    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
                    zIndex: '999',
                }}
            >
                <h4 style={{fontSize: '18px'}}>Справка</h4> {/* Уменьшить размер шрифта для заголовка */}
                <p style={{fontSize: '14px'}}>Приложение позволяет строить графики математических
                    функций</p> {/* Уменьшить размер шрифта для параграфа */}
                <ol>
                    <strong style={{fontSize: '14px'}}>Добавление
                        функций:</strong> {/* Уменьшить размер шрифта для strong */}
                    <ul>
                        <li style={{fontSize: '14px'}}>Введите математическое выражение в поле c 5*x + 1 и нажмите
                            кнопку <span className="button">+</span></li>
                        <li style={{fontSize: '14px'}}>Примеры: 5*x + 1, sin(3*x)</li>
                    </ul>
                    <strong style={{fontSize: '14px'}}>Управление функциями:</strong>
                    <ul>
                        <li style={{fontSize: '14px'}}>Для скрытия/отображения функции кликните на маркер
                            окрашенного круга рядом с функцией
                        </li>
                        <li style={{fontSize: '14px'}}>Для удаления функции нажмите крестик в списке функций
                        </li>
                    </ul>
                    <strong style={{fontSize: '14px'}}>Изменение масштаба графика:</strong>
                    <ul>
                        <li style={{fontSize: '14px'}}>Используйте манипуляторы на графике для изменения
                            масштаба по осям X и Y
                        </li>
                    </ul>
                </ol>
                <button
                    ref={closeButtonRef}
                    onClick={closeHelp}
                    style={{
                        padding: '10px',
                        backgroundColor: '#1a73e8',
                        color: '#fff',
                        border: 'none',
                        cursor: 'pointer',
                        borderRadius: '4px',
                        marginTop: '10px',
                    }}
                >
                    Закрыть
                </button>
            </div>
        )}
    </div>
    <div className="plot-panel" style={{flex: '3', padding: '10px'}}>
        <Plot
            data={generatePlotData()}
            layout={plotLayout}
            config={{displayModeBar: false}}
            style={{width: '100%', height: '100%'}
        }
        />
        <div
            ref={zoomControlsRef}
            tabIndex={-1}
            onKeyDown={handleKeyZoom}
            style={{
                position: 'absolute',
                width: '60%',
                top: '0%',
                right: '1.5%',
            }}
        >
            <ButtonGroup variant="contained" aria-label="Basic button group" size="large">
                <Button ref={buttonRefs?.current[33]} tabIndex={33} onClick={handleZoomInX}>+ X</Button>
                <Button ref={buttonRefs?.current[34]} tabIndex={34} onClick={handleZoomOutX}>- X</Button>
                <Button ref={buttonRefs?.current[35]} tabIndex={35} onClick={handleZoomInY}>+ Y</Button>
                <Button ref={buttonRefs?.current[36]} tabIndex={36} onClick={handleZoomOutY}>- Y</Button>
                <Button ref={buttonRefs?.current[37]} tabIndex={37} onClick={handleResetZoom}>Reset</Button>
            </ButtonGroup>
        </div>
    </div>
    {
        isKeyboardExpanded && (
            <div 
                style={{position: 'absolute', bottom: '0.05%', zIndex: '1'}}>
                <MathKeyboard
                    functionInput={functionInput}
                    setFunctionInput={setFunctionInput}
                    tabIndex={-1}
                    inputRef={inputRef}
                    buttonRefs={buttonRefs}
                    onKeyClick={(key) => setFunctionInput(functionInput => functionInput + key)}
                />
                <div style={{textAlign: 'center', paddingTop: '0.25%'}}>
                        <span onClick={() => setIsKeyboardExpanded(false)} style={{cursor: 'pointer'}}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 30 24 24" width="3.5em" height="6.0em">
                                <path fill="none" d="M0 0h24v24H0z"/>
                                <path d="M7 10l5 5 5-5H7z"/>
                            </svg>
                        </span>
                </div>
            </div>
        )
    }
</div>
);
};

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

export default App;




