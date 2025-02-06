import pandas as pd

# Load the three sheets (replace filenames with actual file names)
level34_df = pd.read_excel(r"C:\Users\ASHLEY\Downloads\employment by educ level34.xlsx", sheet_name="Sheet 1", skiprows=11)
level02_df = pd.read_excel(r"C:\Users\ASHLEY\Downloads\employment by educ level02.xlsx", sheet_name="Sheet 1", skiprows=11)
level58_df = pd.read_excel(r"C:\Users\ASHLEY\Downloads\employment by educ tertiary.xlsx", sheet_name="Sheet 1", skiprows=11)

# Define new column names
new_columns = ['Country', '2023', '2022', '2021', '2020', '2019', '2018', '2017']

# Assign new column names
level02_df.columns = new_columns
level34_df.columns = new_columns
level58_df.columns = new_columns

# Select the first 35 rows
level02_df = level02_df.iloc[:35]
level34_df = level34_df.iloc[:35]
level58_df = level58_df.iloc[:35]

# Function to reshape the dataframe
def reshape_dataframe(df, type_label):
    df = df.melt(id_vars=["Country"], var_name="Year", value_name="Employment Rate (%)")
    df["Education Level"] = type_label
    return df

# Reshape the dataframes
level02_reshaped = reshape_dataframe(level02_df, "Level 0-2")
level34_reshaped = reshape_dataframe(level34_df, "Level 3-4")
level58_reshaped = reshape_dataframe(level58_df, "Level 5-8")

# Concatenate the reshaped dataframes
final_df = pd.concat([level02_reshaped, level34_reshaped, level58_reshaped])

# Reorder the columns to match the expected structure with "Country" first
final_df = final_df[["Country", "Year", "Employment Rate (%)", "Education Level"]]

# Save the final dataframe to a CSV file
final_df.to_csv("combined_employment_data.csv", index=False)

# Print the final dataframe
print(final_df)
