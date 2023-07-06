import React, { useEffect, useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { BsCircleFill } from "react-icons/bs";

const Card = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);


  //fetching character data using axios
  const getUsers = async () => {
    try {
      const response = await axios.get(
        `https://rickandmortyapi.com/api/character/?page=${page}`
      );
      const finalData = response.data;
      setUsers(finalData.results);
    } catch (error) {
      console.log("Error fetching user data:", error);
    }
  };

    //fetching episode data using using episode URL

  const getEpisodeNames = async (episodeUrls) => {
    try {
      const episodePromises = episodeUrls.map((url) => axios.get(url));
      const episodes = await Promise.all(episodePromises);
      const episodeNames = episodes.map((episode) => episode.data.name);
      return episodeNames;
    } catch (error) {
      console.log("Error fetching episode names:", error);
      return [];
    }
  };

  useEffect(() => {
    getUsers();
  }, [page]);

    //rendering episode names//

  const renderEpisodeNames = async (episodeUrls) => {
    try {
      const episodeNames = await getEpisodeNames(episodeUrls);
      return episodeNames;
    } catch (error) {
      console.log("Error rendering episode names:", error);
      return [];
    }
  };

  return (
    <>
      <h2 className="text-body">List of Rick and Morty Characters</h2>
      <div className="container-fluid mt-5">
        <div className="d-flex justify-content-around">
          <button
            className={`btn btn-primary p-2 ${page === 1 ? "disabled" : ""}`}
            onClick={() => {
              setPage((prevPage) => prevPage - 1);
            }}
          >
            prev
          </button>
          <button
            className={`btn btn-primary p-2 ${
              users.length === 0 ? "disabled" : ""
            }`}
            onClick={() => {
              setPage((prevPage) => prevPage + 1);
            }}
          >
            next
          </button>
        </div>

        <div className="row">
          {users.map((curElement) => (
            <CharacterCard
              key={curElement.id}
              character={curElement}
              renderEpisodeNames={renderEpisodeNames}
            />
          ))}
        </div>
      </div>
    </>
  );
};

const CharacterCard = ({ character, renderEpisodeNames }) => {
  const { image, name, status, species, gender, origin, location, episode } =
    character;
  const [episodeNames, setEpisodeNames] = useState([]);
  const [locationDetails, setLocationDetails] = useState(null);
  const [originDetails, setOriginDetails] = useState(null);

  useEffect(() => {
    const fetchEpisodeNames = async () => {
      const names = await renderEpisodeNames(episode);
      setEpisodeNames(names);
    };

    fetchEpisodeNames();
  }, [episode, renderEpisodeNames]);

  const getLocationDetails = async (locationUrl) => {
    try {
      const response = await axios.get(locationUrl);
      const locationDetails = response.data;
      return locationDetails;
    } catch (error) {
      console.log("Error fetching location names:", error);
      return null;
    }
  };

  useEffect(() => {
    const fetchLocationDetails = async () => {
      if (location.url) {
        const details = await getLocationDetails(location.url);
        setLocationDetails(details);
      }
    };

    fetchLocationDetails();
  }, [location.url]);

  const getOriginDetails = async (originUrl) => {
    try {
      const response = await axios.get(originUrl);
      const originDetails = response.data;
      return originDetails;
    } catch (error) {
      console.log("Error fetching location names:", error);
      return null;
    }
  };

  useEffect(() => {
    const fetchOriginDetails = async () => {
      if (origin.url) {
        const details = await getOriginDetails(origin.url);
        setOriginDetails(details);
      }
    };

    fetchOriginDetails();
  }, [origin.url]);

  return (
    <div className="col-12 col-sm-6 col-md-4 col-lg-3 mt-5 ">
      <div className="card border border-dark">
        <div className="profile-image border border-dark">
          <img
            src={image}
            className="rounded"
            width="100%"
            height="auto"
            alt={name}
          />
        </div>
        <div className="description">
          <h4 className="description_name font-weight-bold mb-0 mt-0 textLeft text-body fw-bold">
            {name}
          </h4>
          <div className="character-details  border border-dark  p-1">
            <div className="section ">
              <p className="description_title">Gender: {gender}</p>
              <div className="status-icons d-flex ">
                <p className="description_title">Status: {status}</p>
                {status === "Alive" && (
                  <BsCircleFill className="text-success " />
                )}
                {status === "Dead" && <BsCircleFill className="text-danger" />}
                {status === "unknown" && (
                  <BsCircleFill className="text-secondary" />
                )}
              </div>
              <p className="description_title">Species: {species}</p>
            </div>
          </div>
          <div className="origin-and-location d-flex justify-content-around  border border-dark p-1">
            <div className="section  border border-dark p-1">
              {locationDetails && (
                <>
                  <span className="description_title">
                    Current Location: {location.name}
                  </span>
                  {locationDetails.dimension && (
                    <>
                      <span className="description_title">
                        Dimension: {locationDetails.dimension}
                      </span>
                    </>
                  )}
                  {locationDetails.residents && (
                    <>
                      <span className="description_title">
                        Residents: {locationDetails.residents.length}
                      </span>
                    </>
                  )}
                </>
              )}
            </div>

            <div className="section  border border-dark p-1">
              {originDetails && (
                <>
                  <span className="description_title">
                    Origin Name: {originDetails.name}
                  </span>
                  {originDetails.dimension && (
                    <>
                      <span className="description_title">
                        Dimension: {originDetails.dimension}
                      </span>
                    </>
                  )}
                  {originDetails.residents && (
                    <>
                      <span className="description_title">
                        Residents: {originDetails.residents.length}
                      </span>
                    </>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="section border border-dark p-1">
            <div className="episode-names_list">
              <p className="description_title">Episode Names:</p>

              {episodeNames.length > 0 ? (
                episodeNames.map((episodeName, index) => (
                  <span key={index}>{episodeName} , </span>
                ))
              ) : (
                <span>No episodes found</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

CharacterCard.propTypes = {
  character: PropTypes.shape({
    id: PropTypes.number.isRequired,
    image: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    species: PropTypes.string.isRequired,
    gender: PropTypes.string.isRequired,
    origin: PropTypes.shape({
      name: PropTypes.string.isRequired,
      dimension: PropTypes.string.isRequired,
      residents: PropTypes.arrayOf(PropTypes.string).isRequired,
    }).isRequired,
    location: PropTypes.shape({
      name: PropTypes.string.isRequired,
      dimension: PropTypes.string.isRequired,
      residents: PropTypes.arrayOf(PropTypes.string).isRequired,
    }).isRequired,
    episode: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
};

export default Card;
