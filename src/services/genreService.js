const genreModel = require('../models/genreModel');

const fetchAllGenres = async () => {
    return await genreModel.getAllGenres();
};

const fetchGenreDetails = async (genreID) => {
    const genre = await genreModel.getGenreById(genreID);
    if (genre.length === 0) {
        return null;
    }

    const novels = await genreModel.getNovelsByGenreId(genreID);
    novels.forEach(novel => {
        novel.Locked = novel.locked === 1;
    });

    return {
        genre: genre[0],
        novels
    };
};

const fetchGenresWithNovelCount = async () => {
    return await genreModel.getAllGenresWithCount();
};

const createNewGenre = async (GenreName, Description) => {
    return await genreModel.insertNewGenre(GenreName, Description);
};

const updateGenre = async (GenreID, GenreName, Description) => {
    return await genreModel.updateGenreById(GenreID, GenreName, Description);
};

const deleteGenre = async (GenreID) => {
    return await genreModel.deleteGenreById(GenreID);
};

module.exports = {
    fetchAllGenres,
    fetchGenreDetails,
    fetchGenresWithNovelCount,
    createNewGenre,
    updateGenre,
    deleteGenre
};
