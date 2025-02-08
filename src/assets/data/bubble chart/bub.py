import pandas as pd

# Load the three sheets (replace filenames with actual file names)
# lvl02_df = pd.read_excel('lvl02_education_population_percent.xlsx', sheet_name="Sheet 1", skiprows=13)
# lvl34_df = pd.read_excel('lvl34_education_population_percent.xlsx', sheet_name="Sheet 1", skiprows=13)
# lvl58_df = pd.read_excel('lvl58_education_population_percent.xlsx', sheet_name="Sheet 1", skiprows=13)


gdp_df = pd.read_excel('gdp_countr_years.xlsx', sheet_name="Sheet 1", skiprows=9)



new_columns = ['Country', '2017', '2018', '2019', '2020', '2021', '2022', '2023']

gdp_df.columns = new_columns
gdp_df = gdp_df.iloc[:38]

# print(gdp_df)
# lvl58_df.columns = new_columns
# lvl34_df.columns = new_columns


# lvl02_df = lvl02_df.iloc[:36]
# lvl34_df = lvl34_df.iloc[:36]
# lvl58_df = lvl58_df.iloc[:36]

# print(lvl02_df)
# print("-------------------------------------------------")
# print(lvl34_df)
# print("-------------------------------------------------")
# print(lvl58_df)


# Function to reshape the dataframe
def reshape_dataframe(df):
    df = df.melt(id_vars=["Country"], var_name="Year", value_name="GDP(millions euros)")
    # df["Educational Level"] = type_label
    return df

# Reshape the dataframes
gdp_long = reshape_dataframe(gdp_df)

print(gdp_long)

#save to csv
gdp_long.to_csv("gdp_long.csv", index=False)
# # Reshape the dataframes
# lvl02_long = reshape_dataframe(lvl02_df, "Level 0-2")
# lvl34_long = reshape_dataframe(lvl34_df, "Level 3-4")
# lvl58_long = reshape_dataframe(lvl58_df, "Level 5-8")

# # Concatenate the dataframes
# combined_df = pd.concat([lvl02_long, lvl34_long, lvl58_long], ignore_index=True)

# # Display the combined dataframe
# print(combined_df)

# # Save the combined dataframe to a CSV file
# combined_df.to_csv("combined_population_percent_data.csv", index=False)