import React, { useEffect, useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";

const UseEffectAPI = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);

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
        <div className="row">
          <button
            disabled={page === 1}
            onClick={() => {
              setPage((prevPage) => prevPage - 1);
            }}
          >
            prev
          </button>
          <button
            disabled={users.length === 0}
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
  const { image, name, species, gender, origin, location, episode } = character;
  const [episodeNames, setEpisodeNames] = useState([]);

  useEffect(() => {
    const fetchEpisodeNames = async () => {
      const names = await renderEpisodeNames(episode);
      setEpisodeNames(names);
    };

    fetchEpisodeNames();
  }, [episode, renderEpisodeNames]);

  return (
    <div className="col-12 col-sm-6 col-md-4 col-lg-3 mt-5">
      <div className="card">
          <div className="profile-image">
            <img
              src={image}
              className="rounded"
              width="220"
              height="auto"
              alt={name}
            />
          </div>
          <div className="description">
            <h2 className="description_name font-weight-bold mb-0 mt-0 textLeft text-body">
              {name}
            </h2>
            <h5 className="description_gender mb-0 mt-0 textLeft text-body">
              {gender}
            </h5>
              <div className="origin-and-location ">
                <div className="section ">
                <span className="description_title">Origin:</span>
              <span className="description_value">{origin.name}</span>
              {origin.dimension && (
                <>
                  <span className="description_title">Dimension:</span>
                  <span className="description_value">{origin.dimension}</span>
                </> 
                
              )}
              {origin.residents && (
                <>
                  <span className="description_title">Residents:</span>
                  <span className="description_value">{origin.residents.length}</span>
                </>
              )}
            </div>

                

                <div className="section">
                <span className="description_title">Current Location:</span>
              <span className="description_value">{location.name}</span>
              {location.dimension && (
                <>
                  <span className="description_title">Dimension:</span>
                  <span className="description_value">{location.dimension}</span>
                </>
              )}
              {location.residents && (
                <>
                  <span className="description_title">Residents:</span>
                  <span className="description_value">{location.residents.length}</span>
                </>
              )}
                </div>
              </div>

              <div className="episode-names">
                <span className="description_title">Episode Names:</span>
                <div className="episode-names_list text-body">
                  {episodeNames.length > 0 ? (
                    episodeNames.map((episodeName, index) => (
                      <span key={index}>{episodeName}</span>
                      
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

export default UseEffectAPI;
