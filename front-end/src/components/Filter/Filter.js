import React from "react";
import { Button, Col } from "react-bootstrap";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import "./Filter.css";
import { ChevronExpand } from "react-bootstrap-icons";

const { createSliderWithTooltip } = Slider;
const Range = createSliderWithTooltip(Slider.Range);

export const Filter = ({
  filter,
  setFilter,
  ageSort,
  setAgeSort,
  distanceSort,
  setDistanceSort,
  tagsSort,
  setTagsSort,
  interestSort,
  setInterestSort,
  setFameSort,
  fameSort,
}) => {
  const changeAge = (value) => {
    setFilter({ ...filter, age: value });
  };

  const changeDistance = (value) => {
    setFilter({ ...filter, km: value });
  };

  const SortByAge = () => {
    setDistanceSort({ value: null });
    setFameSort({ value: null });
    setInterestSort({ value: null });
    if (ageSort.value === null) setAgeSort({ value: "asc" });
    if (ageSort.value === "asc") setAgeSort({ value: "desc" });
    else if (ageSort.value === "desc") setAgeSort({ value: "asc" });
  };

  const SortByDistance = () => {
    setAgeSort({ value: null });
    setFameSort({ value: null });
    setInterestSort({ value: null });
    if (distanceSort.value === null) setDistanceSort({ value: "asc" });
    if (distanceSort.value === "asc") setDistanceSort({ value: "desc" });
    else if (distanceSort.value === "desc") setDistanceSort({ value: "asc" });
  };

  const SortByFame = () => {
    setAgeSort({ value: null });
    setDistanceSort({ value: null });
    setInterestSort({ value: null });
    if (fameSort.value === null) setFameSort({ value: "asc" });
    if (fameSort.value === "asc") setFameSort({ value: "desc" });
    else if (fameSort.value === "desc") setFameSort({ value: "asc" });
  };

  const SortByInterest = () => {
    setAgeSort({ value: null });
    setDistanceSort({ value: null });
    setFameSort({ value: null });
    if (interestSort.value === null) setInterestSort({ value: "asc" });
    if (interestSort.value === "asc") setInterestSort({ value: "desc" });
    else if (interestSort.value === "desc") setInterestSort({ value: "asc" });
  };

  const filterInterest = (tag) => {
    setTagsSort(tagsSort.map((x) => (x.name === tag.name ? (tag.actif === 0 ? { ...x, actif: 1 } : { ...x, actif: 0 }) : x)));
  };
  return (
    <>
      <p> Sort by </p>
      <Col className="sort">
        <Button onClick={SortByAge}>
          AGE
          <ChevronExpand className="sort-icon" />
        </Button>
        <Button onClick={SortByDistance}>
          KM
          <ChevronExpand className="sort-icon" />
        </Button>
        <Button onClick={SortByFame}>
          FAME
          <ChevronExpand className="sort-icon" />
        </Button>
        <Button onClick={SortByInterest}>
          TAGS
          <ChevronExpand className="sort-icon" />
        </Button>
      </Col>
      <Col style={{ margin: "50px 0" }}>
        <p>
          {" "}
          Age: {filter.age[0]} à {filter.age[1]} ans
        </p>
        <Range
          min={18}
          allowCross={false}
          value={filter.age}
          marks={{ 18: 18, 100: 100 }}
          tipFormatter={(value) => `${value} ans`}
          onChange={changeAge}
        />
      </Col>
      <Col style={{ margin: "50px 0" }}>
        <p>Distance: {filter.km} km</p>
        <Slider
          min={1}
          max={500}
          step={1}
          value={filter.km}
          marks={{ 1: 1, 500: 500 }}
          tipFormatter={(value) => `${value} km`}
          onChange={changeDistance}
        />
      </Col>
      <Col className="interest">
        <p>Interests</p>
        {tagsSort.map((tag, index) => (
          <Button
            key={index}
            value={tag.value}
            name={tag.name}
            actif={tag.actif}
            className={tag.actif === 1 ? "interestActif size" : "size"}
            onClick={(e) => filterInterest(tag)}
          >
            {tag.name}
          </Button>
        ))}
      </Col>
    </>
  );
};
