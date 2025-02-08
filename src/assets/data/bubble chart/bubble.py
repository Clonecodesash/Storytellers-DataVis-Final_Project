import pandas as pd

gdp_df = pd.read_csv('gdp_long.csv')
data_df = pd.read_csv('final_combined_bubble_data.csv')

# # Load the three sheets (replace filenames with actual file names)
# population_df = pd.read_csv('combined_population_percent_data.csv')
# income_df = pd.read_csv('combined_mean_income_data.csv')
# employment_df = pd.read_csv('combined_employment_data.csv')

# employment_df.rename(columns={"Education Level": "Educational Level"}, inplace=True)


# print(population_df)
# print("-------------------------------------------------")
# print(income_df)
# print("-------------------------------------------------")
# print(employment_df)


# print(population_df.columns)
# print("-------------------------------------------------")
# print(income_df.columns)
# print("-------------------------------------------------")
# print(employment_df.columns)

# merged_df = population_df.merge(income_df, on=["Country", "Year", "Educational Level"], how="inner")
# merged_df = merged_df.merge(employment_df, on=["Country", "Year", "Educational Level"], how="inner")

merged_df = data_df.merge(gdp_df, on=["Country", "Year"], how="left")


print(merged_df)

merged_df.to_csv("final_combined_bubble_data.csv", index=False)