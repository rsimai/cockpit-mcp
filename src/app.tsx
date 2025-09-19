/*
 * This file is part of Cockpit.
 *
 * Copyright (C) 2017 Red Hat, Inc.
 *
 * Cockpit is free software; you can redistribute it and/or modify it
 * under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation; either version 2.1 of the License, or
 * (at your option) any later version.
 *
 * Cockpit is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with Cockpit; If not, see <http://www.gnu.org/licenses/>.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@patternfly/react-core/dist/esm/components/Button/index.js";
import { TextInput } from "@patternfly/react-core/dist/esm/components/TextInput/index.js";
import { TextArea } from "@patternfly/react-core/dist/esm/components/TextArea/index.js";
import { Stack, StackItem } from "@patternfly/react-core/dist/esm/layouts/Stack/index.js";

import cockpit from 'cockpit';

const _ = cockpit.gettext;

export const Application = () => {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [isRunning, setIsRunning] = useState(false);
    const outputRef = useRef(null);

    useEffect(() => {
        if (outputRef.current) {
            outputRef.current.scrollTop = outputRef.current.scrollHeight;
        }
    }, [output]);

    const sendMessage = () => {
        if (!input.trim()) return;
        
        setOutput(prev => prev + `> ${input}\n`);
        
        // Execute mcphost wrapper
        const proc = cockpit.spawn(['/home/robert/git/cockpit-mcp/mcphost-wrapper', input], { err: 'message' });
        
        proc.done((data) => {
            setOutput(prev => prev + data + '\n\n');
        });
        
        proc.fail((error) => {
            setOutput(prev => prev + `Error: ${error}\n\n`);
        });
        
        setInput('');
    };

    return (
        <Stack hasGutter>
            <StackItem>
                <h1>MCP</h1>
            </StackItem>
            <StackItem>
                <TextInput
                    value={input}
                    onChange={(_, value) => setInput(value)}
                    placeholder={_("Enter message...")}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                />
            </StackItem>
            <StackItem>
                <Button onClick={sendMessage} isDisabled={!input.trim()}>
                    {_("Send")}
                </Button>
                {' '}
                <Button variant="secondary" onClick={() => {
                    setOutput(prev => prev + "> What are your capabilities?\n");
                    const proc = cockpit.spawn(['/home/robert/git/cockpit-mcp/mcp-capabilities'], { err: 'message' });
                    proc.done((data) => setOutput(prev => prev + data + '\n\n'));
                    proc.fail((error) => setOutput(prev => prev + `Error: ${error}\n\n`));
                }}>
                    {_("Show Capabilities")}
                </Button>
            </StackItem>
            <StackItem isFilled>
                <TextArea
                    ref={outputRef}
                    value={output}
                    readOnly
                    style={{ height: 'calc(100vh - 200px)', minHeight: '400px' }}
                    placeholder={_("Output will appear here...")}
                />
            </StackItem>
        </Stack>
    );
};
