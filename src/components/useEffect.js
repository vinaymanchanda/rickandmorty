import React, { useEffect, useState } from 'react';


const UseEffectAPI = () => {
  const [users, setUsers] = useState([]);

  const getUsers = async () => {
    const response = await fetch('https://rickandmortyapi.com/api/character/');
    const finalData = await response.json();
    setUsers(finalData.results);
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <>
      <h2>List of Rick and Morty Characters</h2>
      <div className='container-fluid mt-5'>
        <div className='row text-center'>
          {users.map((curElement) => (
            <div key={curElement.id} className='col-10 col-md-4 mt-5'>
              <div className='card p-2'>
                <div className='d-flex align-items-center'>
                  <div className='image'>
                    <img src={curElement.image} className='rounded' width='155' alt='' />
                  </div>
                  <div className='ml-3 w-100'>
                    <h4 className='mb-0 mt-0 textLeft text-body'>{curElement.name}</h4>
                    <h5 className='mb-0 mt-0 textLeft text-body'>{curElement.gender}</h5>
                    <div className='pt-3 mt-3 bg-primary justify-content-between rounded text-body stats'>
                      
                      <div className='section d-flex flex-column'>
                        <span className='text-body'>origin</span>
                        <span className='text-body'>earth </span>
                      </div>
                      
                      <div className='section d-flex flex-column  text-center'>
                        <span className='location'>location</span>
                        <span className='number3'>c-123</span>
                      </div>
                      <div className='section d-flex flex-column  text-center '>
                        <span className='episode'></span>
                        <span className='number3'></span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default UseEffectAPI;
