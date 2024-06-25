import os

def concatenate_files():
    folder_path = os.path.dirname(os.path.abspath(__file__))
    script_name = os.path.basename(__file__)
    output_filename = 'combined.txt'
    output_file = os.path.join(folder_path, output_filename)
    valid_extensions = ('.css', '.js', '.html', '.py', '.txt')

    with open(output_file, 'w') as outfile:
        for filename in os.listdir(folder_path):
            if filename != script_name and filename != output_filename and filename != 'script.js' and filename != 'index.html' and filename.endswith(valid_extensions):
                file_path = os.path.join(folder_path, filename)
                outfile.write(f'=== {filename} ===\n')
                with open(file_path, 'r') as infile:
                    outfile.write(infile.read())
                outfile.write('\n')

# Run the function
concatenate_files()
