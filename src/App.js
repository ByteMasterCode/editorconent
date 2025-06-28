import React from 'react';
import { Editor } from '@craftjs/core';
import { PagesProvider } from './contexts/PagesContext';
import { Topbar } from './components/Topbar';
import { Toolbox } from './components/Toolbox';
import { PagesPanel } from './components/PagesPanel';
import { Canvas } from './components/Canvas';

// Импорт всех пользовательских компонентов
import { Text } from './components/user/Text';
import { Button } from './components/user/Button';
import { CodeBlock } from './components/user/CodeBlock';
import { Container } from './components/user/Container';
import { Image } from './components/user/Image';
import { Video } from './components/user/Video';
import { Audio } from './components/user/Audio';
import { Iframe } from './components/user/Iframe';
import { Chart } from './components/user/Chart';
import { Document } from './components/user/Document';
import { ProductSelection } from './components/user/ProductSelection';
import { CourseTimeline } from './components/user/CourseTimeline';
import { QuizBuilder } from './components/user/QuizBuilder';
import {PropertiesLayersPanel} from "./components/PropertiesLayersPanel";
import { Shape } from './components/user/Shape';

import {HotkeyProvider} from "./contexts/HotkeyContext";
import {HotkeyManager} from "./components/HotkeyManager";

function App() {
    return (
     <HotkeyProvider>
        <PagesProvider>
            <div className="h-screen flex flex-col bg-gray-950 text-white overflow-hidden">
                <Editor
                    resolver={{
                        Text,
                        Button,
                        CodeBlock,
                        Container,
                        Image,
                        Video,
                        Audio,
                        Iframe,
                        Chart,
                        Document,
                        ProductSelection,
                        CourseTimeline,
                        QuizBuilder,
                        Shape
                    }}
                >
                    <HotkeyManager/>
                    <Topbar />

                    <div className="flex flex-1 overflow-hidden">
                        {/* Левая панель - Страницы */}
                        <PagesPanel />

                        {/* Панель инструментов */}
                        <Toolbox />

                        {/* Главная зона - Canvas */}
                        <Canvas />

                        {/* Правая панель - Свойства */}
                        <PropertiesLayersPanel />
                    </div>
                </Editor>
            </div>
        </PagesProvider>
     </HotkeyProvider>
    );
}

export default App;
