import React, { useState, useEffect, useRef } from 'react';
import Plot from 'react-plotly.js';
import MathKeyboard from './MathKeyboard.js';
import { createSmartappDebugger, createAssistant } from '@salutejs/client';
import './styles.css';
import './index.css';
import './voice.css';
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
    const [isKeyboardFocused, setIsKeyboardFocused] = useState(false);
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
                width: window.innerWidth * 0.7, // Примерное значение ширины графика
                height: window.innerHeight * 0.65, // Примерное значение высоты графика
            }));
        };

        handleResize();

        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);


    const initializeAssistant = (getState) => {
        if (process.env.NODE_ENV === 'development') {
            return createSmartappDebugger({
                token: process.env.REACT_APP_TOKEN ?? '',
                initPhrase: `Запусти ${process.env.REACT_APP_SMARTAPP}`,
                getState,
            });
        }
        return createAssistant({ getState });
    };

    useEffect(() => {
        window.addMathFunction = (func, context) => {
            setFunctionInput(prev => prev + func);
        };
        const getState = () => ({ functions });
        const assistant = initializeAssistant(getState);
        assistant.on('data', handleAssistantData);
    }, [functions]);

    useEffect(() => {
        if (isKeyboardExpanded && functionListRef.current) {
            functionListRef.current.focus();
        }
    }, [isKeyboardExpanded]);

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
           addButtonRef.current.focus();
       } else if (e.key === 'ArrowDown') {
           if (functions.length > 0) {
               functionRefs.current[0].focus();
           }
       } else if (e.key === 'ArrowRight') {
           addButtonRef.current.focus();
       }
   };

   const handleAddFunctionKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleAddFunction();
        } else if (e.key === 'ArrowDown' && functions.length > 0) {
            functionRefs.current[0].focus();
        } else if (e.key === 'ArrowUp') {
            inputRef.current.focus();
        } else if (e.key === 'ArrowLeft') {
            inputRef.current.focus();
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
        if (e.key === 'ArrowDown' && index < functions.length - 1) {
            colorRefs.current[index + 1].focus();
        } else if (e.key === 'ArrowUp') {
            if (index > 0) {
                colorRefs.current[index - 1].focus();
            } else {
                inputRef.current.focus();
            }
        } else if (e.key === 'ArrowRight') {
            removeButtonRefs.current[index].focus();
        }

        if (index === functions.length - 1 && ['ArrowDown', 'ArrowRight'].includes(e.key)) {
            buttonRefs.current.focus(); // Фокус на inputRef после последнего элемента списка функций
        }
    };

    const handleColorKeyDown = (e, index) => {
        if (e.key === 'ArrowRight') {
            removeButtonRefs.current[index].focus();
        } else if (e.key === 'ArrowLeft') {
            functionRefs.current[index].focus();
        } else if (e.key === 'ArrowDown' && index < functions.length - 1) {
            colorRefs.current[index + 1].focus();
        } else if (e.key === 'ArrowUp') {
            if (index > 0) {
                colorRefs.current[index - 1].focus();
            } else {
                inputRef.current.focus();
            }
        } else if (e.key === 'Enter') {
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
            colorRefs.current[index].focus();
        } else if (e.key === 'ArrowRight') {
            functionRefs.current[index].focus();
        } else if (e.key === 'ArrowDown' && index < functions.length - 1) {
            colorRefs.current[index + 1].focus();
        } else if (e.key === 'ArrowUp') {
            if (index > 0) {
                colorRefs.current[index - 1].focus();
            } else {
                inputRef.current.focus();
            }
        } else if (e.key === 'Enter') {
            setFunctions((prevFunctions) => prevFunctions.filter((_, i) => i !== index));
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

    // Функция для открытия справки
    const openHelpModal = () => {
        setIsHelpVisible(true);
    };

    // Функция для закрытия справки
    const closeHelpModal = () => {
        setIsHelpVisible(false);
    };

    const generatePlotData = () => {
        return functions.map(({func, color}) => {
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
        }).filter(data => data !== null);
    };

    return (
        <div style={{display: 'flex', height: '100vh'}}>
            <div className="app-container"
                 style={{flex: '1', height: 'auto', borderRight: '1px solid #ccc', flexDirection: 'column'}}>
                <div className="input-panel" style={{display: 'flex', alignItems: 'center'}}>
                    <input
                        tabIndex={1}
                        ref={inputRef}
                        type="text"
                        placeholder="5*x + 1"
                        value={functionInput}
                        onChange={handleFunctionInputChange}
                        onKeyDown={handleInputKeyDown}
                        onTouchStart={(e) => e.preventDefault()}  // Prevent default touch event to avoid showing system keyboard
                        style={{padding: '10px', width: '150%', margin: '0'}}
                    />
                    <button
                        tabIndex={1}
                        ref={addButtonRef}
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
    <span onClick={openHelpModal} style={{cursor: 'pointer'}}>
        <button
            style={{
                width: '30px',
                height: '30px',
                backgroundColor: '#1a73e8',
                color: '#fff',
                border: 'none',
                borderRadius: '50%',
                fontSize: '20px',
            }}
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
                        <li style={{fontSize: '14px'}}>Введите математическое выражение в поле ввода и нажмите
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
                    onClick={closeHelpModal}
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
            style={{width: '100%', height: '100%'}}
        />
    </div>
    // {
    //     isKeyboardExpanded && (
    //         <div 
    //             style={{position: 'absolute', bottom: '0.05%', zIndex: '1'}}>
    //             <MathKeyboard
    //                 tabIndex={-1}
    //                 inputRef={inputRef}
    //                 onKeyClick={(key) => setFunctionInput(functionInput + key)}
    //             />
    //             <div style={{textAlign: 'center', paddingTop: '0.25%'}}>
    //                     <span onClick={() => setIsKeyboardExpanded(false)} style={{cursor: 'pointer'}}>
    //                         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 30 24 24" width="3.5em" height="4.0em">
    //                             <path fill="none" d="M0 0h24v24H0z"/>
    //                             <path d="M7 10l5 5 5-5H7z"/>
    //                         </svg>
    //                     </span>
    //             </div>
    //         </div>
    //     )
    // }
</div>
)
    ;
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






