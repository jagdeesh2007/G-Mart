import os
import re

def process_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    if '@Data' not in content and '@Builder' not in content:
        return

    # Strip lombok imports and annotations
    content = re.sub(r'import lombok\..*;\n', '', content)
    content = re.sub(r'@Data\n', '', content)
    content = re.sub(r'@Builder\n', '', content)
    content = re.sub(r'@NoArgsConstructor\n', '', content)
    content = re.sub(r'@AllArgsConstructor\n', '', content)
    content = re.sub(r'@Builder\.Default\n\s*', '', content)

    # Extract class name
    class_match = re.search(r'public class (\w+)', content)
    if not class_match:
        return
    class_name = class_match.group(1)

    # Extract fields
    fields = re.findall(r'private\s+([\w<>,\s]+?)\s+(\w+)(?:\s*=\s*[^;]+)?;', content)
    
    getters_setters = ""
    constructor_args = []
    constructor_assigns = []
    
    for f_type, f_name in fields:
        f_type = f_type.strip()
        f_name = f_name.strip()
        capitalized = f_name[0].upper() + f_name[1:]
        
        getters_setters += f"    public {f_type} get{capitalized}() {{ return {f_name}; }}\n"
        getters_setters += f"    public void set{capitalized}({f_type} {f_name}) {{ this.{f_name} = {f_name}; }}\n"
        
        constructor_args.append(f"{f_type} {f_name}")
        constructor_assigns.append(f"        this.{f_name} = {f_name};")

    no_args = f"    public {class_name}() {{}}\n"
    all_args = f"    public {class_name}({', '.join(constructor_args)}) {{\n" + "\n".join(constructor_assigns) + "\n    }\n"
    
    builder_methods = ""
    builder_class = f"    public static {class_name}Builder builder() {{ return new {class_name}Builder(); }}\n"
    builder_class += f"    public static class {class_name}Builder {{\n"
    for f_type, f_name in fields:
        builder_class += f"        private {f_type} {f_name};\n"
        builder_class += f"        public {class_name}Builder {f_name}({f_type} {f_name}) {{ this.{f_name} = {f_name}; return this; }}\n"
    builder_class += f"        public {class_name} build() {{ return new {class_name}({', '.join([f_name for _, f_name in fields])}); }}\n"
    builder_class += "    }\n"

    last_brace = content.rfind('}')
    if last_brace != -1:
        content = content[:last_brace] + "\n" + no_args + "\n" + all_args + "\n" + builder_class + "\n" + getters_setters + content[last_brace:]

    with open(filepath, 'w') as f:
        f.write(content)

for root, _, files in os.walk('src/main/java/com/getmart'):
    for file in files:
        if file.endswith('.java'):
            process_file(os.path.join(root, file))
