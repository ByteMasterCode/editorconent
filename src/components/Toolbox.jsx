import React from 'react';
import { Element, useEditor } from '@craftjs/core';
import {
    Type, Square, Code, MousePointer, Layout, Sparkles,
    Image as ImageIcon, Video as VideoIcon, Music, Globe,
    BarChart3, FileText, ShoppingCart, Clock, HelpCircle
} from 'lucide-react';

import { Text } from './user/Text';
import { Button } from './user/Button';
import { CodeBlock } from './user/CodeBlock';
import { Container } from './user/Container';
import { Image } from './user/Image';
import { Video } from './user/Video';
import { Audio } from './user/Audio';
import { Iframe } from './user/Iframe';
import { Chart } from './user/Chart';
import { Document } from './user/Document';
import { ProductSelection } from './user/ProductSelection';
import { CourseTimeline } from './user/CourseTimeline';
import { QuizBuilder } from './user/QuizBuilder';
import {Shape} from "./user/Shape";

export const Toolbox = () => {
    const { connectors } = useEditor();

    const tools = [
        {
            name: 'Text',
            icon: Type,
            element: <Text text="New text" />,
            description: 'Add text content',
            category: 'Basic'
        },
        {
            name: 'Tugma',
            icon: MousePointer,
            element: <Button text="Tugma nomi..." />,
            description: 'Intaraktiv tugma',
            category: 'Basic'
        },
        {
            name: 'Container',
            icon: Square,
            element: <Element is={Container} canvas />,
            description: 'Layout container',
            category: 'Layout'
        },
        {
            name: 'Shape',
            icon: Square, // можно заменить на другой
            element: <Shape type="rectangle" />,
            description: 'Basic shape component',
            category: 'Shapes'
        },
        {
            name: 'Image',
            icon: ImageIcon,
            element: <Image />,
            description: 'Upload and display images',
            category: 'Media'
        },
        {
            name: 'Video',
            icon: VideoIcon,
            element: <Video />,
            description: 'Upload and play videos',
            category: 'Media'
        },
        {
            name: 'Audio',
            icon: Music,
            element: <Audio />,
            description: 'Upload and play audio',
            category: 'Media'
        },
        {
            name: 'Document',
            icon: FileText,
            element: <Document />,
            description: 'PDF, Excel, PowerPoint, Word',
            category: 'Documents'
        },
        {
            name: 'Iframe',
            icon: Globe,
            element: <Iframe />,
            description: 'Embed websites, online docs',
            category: 'Embed'
        },
        {
            name: 'Chart',
            icon: BarChart3,
            element: <Chart />,
            description: 'Data visualization charts',
            category: 'Data'
        },
        {
            name: 'Code Block',
            icon: Code,
            element: <CodeBlock code="// Write your code here\nconsole.log('Hello, World!');" />,
            description: 'Syntax highlighted code',
            category: 'Advanced'
        },
        {
            name: 'Product Selection',
            icon: ShoppingCart,
            element: <ProductSelection />,
            description: 'Course packages selector',
            category: 'Course'
        },
        {
            name: 'Timeline',
            icon: Clock,
            element: <CourseTimeline />,
            description: 'Course progress timeline',
            category: 'Course'
        },
        {
            name: 'Quiz Builder',
            icon: HelpCircle,
            element: <QuizBuilder />,
            description: 'Interactive quiz creator',
            category: 'Course'
        }
    ];

    const categories = [...new Set(tools.map(tool => tool.category))];

    return (
        <div className="bg-gray-900/95 backdrop-blur-sm border-r border-gray-800/50 w-80 flex flex-col">
            <div className="p-4 border-b border-gray-800/50">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-5 h-5 bg-gradient-to-br from-blue-500 to-purple-600 rounded flex items-center justify-center">
                        <Layout className="w-3 h-3 text-white" />
                    </div>
                    <h3 className="text-sm font-semibold text-white">Components</h3>
                </div>
                <p className="text-xs text-gray-400">Drag to add elements</p>
            </div>

            <div className="flex-1 overflow-y-auto">
                {categories.map((category) => (
                    <div key={category} className="p-3">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="h-px bg-gradient-to-r from-gray-700 to-transparent flex-1" />
                            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider px-2">
                {category}
              </span>
                            <div className="h-px bg-gradient-to-l from-gray-700 to-transparent flex-1" />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            {tools
                                .filter(tool => tool.category === category)
                                .map((tool, index) => (
                                    <div
                                        key={index}
                                        ref={(ref) => connectors.create(ref, tool.element)}
                                        className="group relative bg-gray-800/40 hover:bg-gray-800/70 border border-gray-700/40 hover:border-gray-600/60 rounded-lg p-3 cursor-move transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/10 hover:scale-[1.02]"
                                    >
                                        <div className="flex flex-col items-center text-center gap-2">
                                            <div className="w-8 h-8 bg-gradient-to-br from-gray-700/50 to-gray-800/50 rounded-lg flex items-center justify-center group-hover:from-blue-500/20 group-hover:to-purple-500/20 transition-all duration-200">
                                                <tool.icon className="w-4 h-4 text-gray-300 group-hover:text-blue-400" />
                                            </div>
                                            <div>
                                                <h4 className="text-xs font-medium text-white group-hover:text-blue-400 transition-colors">
                                                    {tool.name}
                                                </h4>
                                                <p className="text-[10px] text-gray-500 mt-0.5 leading-tight">
                                                    {tool.description}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <div className="w-4 h-4 bg-blue-500/20 rounded flex items-center justify-center">
                                                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-3 border-t border-gray-800/50">
                <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                        <Sparkles className="w-3 h-3 text-blue-400" />
                        <h4 className="text-xs font-semibold text-blue-400 uppercase tracking-wider">New</h4>
                    </div>
                    <p className="text-xs text-gray-300 leading-relaxed">
                        Course components: Product Selection, Timeline, and Quiz Builder for interactive learning experiences
                    </p>
                </div>
            </div>
        </div>
    );
};
