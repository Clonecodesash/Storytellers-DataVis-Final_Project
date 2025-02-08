import pandas as pd

# Load GDP PPS dataset
gdp_df = pd.read_csv("gdp_pps_long.csv")

# Load Educational Attainment dataset
edu_df = pd.read_csv(r"C:\Users\ASHLEY\Documents\GitHub\Storytellers-DataVis-Final_Project\combined_education_data.csv")

print("GDP PPS dataset:")
print(gdp_df)
print("\n\nEducational Attainment dataset:")
print(edu_df)

# Filter only "Total" type in educational attainment data
edu_df = edu_df[edu_df["Type"] == "Total"]

# Drop "Type" column since it's no longer needed
edu_df = edu_df.drop(columns=["Type"])

# Merge datasets on Country and Year
merged_df = gdp_df.merge(edu_df, on=["Country", "Year"], how="inner")

# Save the merged dataset
merged_df.to_csv("merged_scatterdata.csv", index=False)

print("Merged dataset saved as merged_data.csv")
