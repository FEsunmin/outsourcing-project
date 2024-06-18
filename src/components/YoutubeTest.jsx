import { useEffect, useState } from 'react';
import api from '../api/api';

const YoutubeTest = () => {
  const [videos, setVideos] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태 추가
  const [totalPages, setTotalPages] = useState(1); // 전체 페이지 상태 추가
  const itemsPerPage = 12; // 페이지당 항목 수

  useEffect(() => {
    const fetchData = async () => {
      try {
        const playlistId = 'PLH13Vc2FtHHguyxRNXcHgy84PHYgxBGuc';
        const playlistData = await api.youtube.fetchPlaylistItems(playlistId);

        if (!playlistData || !playlistData.items) {
          throw new Error('Playlist data is undefined');
        }

        const playlistItems = playlistData.items;
        console.log('Playlist Items:', playlistItems);

        let filteredItems = playlistItems;

        if (searchKeyword) {
          filteredItems = playlistItems.filter((item) => {
            const itemTitle = item.snippet.title.trim().toLowerCase();
            return itemTitle.includes(searchKeyword.trim().toLowerCase());
          });
          console.log('Filtered Items:', filteredItems);
        }

        // 페이지네이션을 위한 전체 페이지 수 설정
        setTotalPages(Math.ceil(filteredItems.length / itemsPerPage));

        // 현재 페이지에 해당하는 항목만 가져오기
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const currentItems = filteredItems.slice(startIndex, endIndex);

        if (currentItems.length > 0) {
          const videoIds = currentItems.map(
            (item) => item.contentDetails.videoId
          );
          const videoDetails = await api.youtube.fetchVideoDetails(videoIds);
          console.log('Video Details:', videoDetails);

          const videosWithDetails = currentItems.map((item) => {
            const videoDetail = videoDetails.find(
              (detail) => detail.id === item.contentDetails.videoId
            );
            return {
              ...item,
              statistics: videoDetail.statistics,
            };
          });

          setVideos(videosWithDetails);
        } else {
          setVideos([]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [searchKeyword, currentPage]); // currentPage 상태 추가

  const handleSearch = (event) => {
    event.preventDefault();
    const keyword = event.target.elements.keyword.value;
    setSearchKeyword(keyword);
    setCurrentPage(1); // 검색 시 현재 페이지를 1로 초기화
  };

  // 페이지 변경 핸들러
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // 페이지 번호 렌더링 함수
  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          disabled={i === currentPage}
          style={{ margin: '0 5px', padding: '5px 10px' }}
        >
          {i}
        </button>
      );
    }
    return pageNumbers;
  };

  console.log(searchKeyword);

  return (
    <div>
      <h1>유튜브 재생목록 검색</h1>
      <form onSubmit={handleSearch}>
        <input type="text" name="keyword" placeholder="검색어 입력" />
        <button type="submit">검색</button>
      </form>
      <h2>재생목록 결과</h2>
      <ul>
        {videos.map((item) => (
          <li key={item.contentDetails.videoId}>
            <h2>{item.snippet.title}</h2>
            <img
              src={item.snippet.thumbnails.default.url}
              alt={item.snippet.title}
            />
            <p>조회수: {item.statistics.viewCount}</p>
            <p>좋아요 수: {item.statistics.likeCount}</p>
            <a
              href={`https://www.youtube.com/watch?v=${item.contentDetails.videoId}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Watch Video
            </a>
          </li>
        ))}
      </ul>
      <div>{renderPageNumbers()}</div>
    </div>
  );
};

export default YoutubeTest;
