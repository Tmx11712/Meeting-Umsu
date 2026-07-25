const fs = require('fs');
const path = require('path');
const dir = 'resources/js/pages/configuration';

function processDir(d) {
    const files = fs.readdirSync(d);
    for (const f of files) {
        const fullPath = path.join(d, f);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (fullPath.endsWith('.tsx')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let original = content;
            
            // Replace route('configuration.index') with '/configuration'
            content = content.replace(/route\('configuration\.index'\)/g, "'/configuration'");
            
            // Replace route('configuration.XXX.index') with '/configuration/XXX'
            content = content.replace(/route\('configuration\.([^']+)\.index'\)/g, "'/configuration/$1'");
            
            // Replace route('configuration.XXX.update', id) with `/configuration/XXX/${id}`
            content = content.replace(/route\('configuration\.([^']+)\.update',\s*([^)]+)\)/g, (match, p1, p2) => {
                return "`" + `/configuration/${p1}/${p2.trim()}` + "`";
            });
            
            // Toggle route
            content = content.replace(/route\('configuration\.menus\.toggle',\s*([^)]+)\)/g, (match, p1) => {
                return "`" + `/configuration/menus/${p1.trim()}/toggle` + "`";
            });

            if (content !== original) {
                fs.writeFileSync(fullPath, content);
                console.log('Fixed:', fullPath);
            }
        }
    }
}
processDir(dir);
