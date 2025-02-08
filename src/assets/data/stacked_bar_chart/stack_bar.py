import pandas as pd


data_df = pd.read_csv('final_combined_bubble_data.csv')

gdp_df = pd.read_excel('gini_index_income.xlsx', sheet_name="Sheet 1", skiprows=9)

print(gdp_df)
new_columns = ['Country', '2017', '2018', '2019', '2020', '2021', '2022', '2023']

gdp_df.columns = new_columns

gdp_df = gdp_df.iloc[:36]
print(gdp_df)
# Function to reshape the dataframe
def reshape_dataframe(df):
    df = df.melt(id_vars=["Country"], var_name="Year", value_name="Gini Index(0-100)")
    # df["Educational Level"] = type_label
    return df

# Reshape the dataframes
gdp_long = reshape_dataframe(gdp_df)
print(gdp_long)

data_df['Year'] = data_df['Year'].astype(str)
gdp_long['Year'] = gdp_long['Year'].astype(str)

merged_df = data_df.merge(gdp_long, on=["Country", "Year"], how="left")

print(merged_df)

merged_df.to_csv("final_combined_stacked_bar_data.csv", index=False)