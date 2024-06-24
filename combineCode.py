import os

def concatenate_files():
    folder_path = os.path.dirname(os.path.abspath(__file__))
    script_name = os.path.basename(__file__)
    output_file = os.path.join(folder_path, 'combined_code.txt')
    valid_extensions = ('.css', '.js', '.html', '.py', '.txt')

    with open(output_file, 'w') as outfile:
        for filename in os.listdir(folder_path):
            if filename != script_name and filename != 'combined_code.txt' and filename.endswith(valid_extensions):
                file_path = os.path.join(folder_path, filename)
                outfile.write(f'=== {filename} ===\n')
                with open(file_path, 'r') as infile:
                    outfile.write(infile.read())
                outfile.write('\n')

# Run the function
concatenate_files()
