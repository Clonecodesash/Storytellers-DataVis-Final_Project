import pandas as pd

#Load the three sheets (replace filenames with actual file names)
lvl02_df = pd.read_excel('umemployment_percentage02.xlsx', sheet_name="Sheet 1", skiprows=11)
lvl34_df = pd.read_excel('umemployment_percentage34.xlsx', sheet_name="Sheet 1", skiprows=11)
lvl58_df = pd.read_excel('umemployment_percentage58.xlsx', sheet_name="Sheet 1", skiprows=11)

new_columns = ['Country', '2023', '2022', '2021', '2020', '2019', '2018', '2017']

lvl02_df.columns = new_columns
lvl58_df.columns = new_columns
lvl34_df.columns = new_columns

def reshape_dataframe(df, type_label):
    df = df.melt(id_vars=["Country"], var_name="Year", value_name="Unemployment Rate")
    df["Educational Level"] = type_label
    return df

lvl02_df = lvl02_df.iloc[:36]
lvl34_df = lvl34_df.iloc[:36]
lvl58_df = lvl58_df.iloc[:36]

# print(lvl02_df)
# print("-------------------------------------------------")
# print(lvl34_df)
# print("-------------------------------------------------")
# print(lvl58_df)

lvl02_long = reshape_dataframe(lvl02_df, "Level 0-2")
lvl34_long = reshape_dataframe(lvl34_df, "Level 3-4")
lvl58_long = reshape_dataframe(lvl58_df, "Level 5-8")

combined_df = pd.concat([lvl02_long, lvl34_long, lvl58_long], ignore_index=True)

# Display the combined dataframe
print(combined_df)

# Save the combined dataframe to a CSV file
combined_df.to_csv("combined_heatmap_employment_data.csv", index=False)

