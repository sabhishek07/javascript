import { FormControl, MenuItem, Select, Card, CardContent } from '@material-ui/core';
import './App.css';
import React, { useEffect, useState } from 'react';
import InfoBox from './InfoBox';
import Map from './Map';
import Table from './Table';
import { sortData } from './util';
function App() {
  const [countries, setCountries] = useState([]);
  const [Worldwide, setWorldwide] = useState("worldwide")
  const [CountryInfo, setCountryInfo] = useState({});
  const [Tabledata, setTabledata] = useState([]);
  //https://disease.sh/v3/covid-19/countries

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((res) => res.json())
      .then((data) => {
        setCountryInfo(data);
      })
  })

  useEffect(() => {

    const getCountriesdata = async () => {
      const a = await fetch("https://disease.sh/v3/covid-19/countries")
        .then((res) => res.json())
        .then((data) => {
          const countries = data.map((country) => (
            {
              name: country.country,
              value: country.countryInfo.iso2

            }
          ));
          const sortedData = sortData(data);
          setTabledata(sortedData);

          setCountries(countries);




        })
    }
    console.log(CountryInfo);

    getCountriesdata();
  }, []);
  const onChangeCode = async (event) => {

    const countryCode = event.target.value;

    const url = countryCode === "worldwide" ? "https://disease.sh/v3/covid-19/all"
      : `https://disease.sh/v3/covid-19/countries/${countryCode}`

    await fetch(url)
      .then(res => res.json())
      .then(data => {
        setWorldwide(countryCode);
        setCountryInfo(data);

      })


  }
  console.log(CountryInfo);
  return (
    <div className="app">
      <div className="app__left">
        <div className="app_header">
          <h1>covid-19 tracker</h1>
          <FormControl className='app_dropdown'>
            <Select variant='outlined' onChange={onChangeCode} value={Worldwide}>
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {
                countries.map((country) => (
                  <MenuItem value={country.value}>{country.name}</MenuItem>

                ))
              }
            </Select>

          </FormControl>


        </div>

        <div className="app__stats">
          <InfoBox title="coronavirus cases" cases={CountryInfo.todayCases} total={CountryInfo.cases} />
          <InfoBox title="Recoverd" cases={CountryInfo.todayRecovered} total={CountryInfo.recovered} ></InfoBox>

          <InfoBox title="Deaths" cases={CountryInfo.todaydeaths} total={CountryInfo.deaths}> </InfoBox>

        </div>
        <Map />

      </div>

      <Card className="app__right">
        <CardContent>
          <h3>Live Cases by Country</h3>
          <Table countries={Tabledata} />
          <h3>Worldwide CASES </h3>
        </CardContent>


      </Card>


    </div>
  );
}

export default App;
