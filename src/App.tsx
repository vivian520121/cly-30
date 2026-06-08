import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home } from "@/pages/Home";
import { HotPlaylists } from "@/pages/HotPlaylists";
import { RecommendSongs } from "@/pages/RecommendSongs";
import { NewSongs } from "@/pages/NewSongs";
import { SearchResults } from "@/pages/SearchResults";
import { SongDetail } from "@/pages/SongDetail";
import { ArtistDetail } from "@/pages/ArtistDetail";
import { PlaylistDetail } from "@/pages/PlaylistDetail";
import { UploadPlaylist } from "@/pages/UploadPlaylist";
import { PlayerControls } from "@/components/player/PlayerControls";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/hot" element={<HotPlaylists />} />
        <Route path="/recommend" element={<RecommendSongs />} />
        <Route path="/new" element={<NewSongs />} />
        <Route path="/upload" element={<UploadPlaylist />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/song/:id" element={<SongDetail />} />
        <Route path="/artist/:id" element={<ArtistDetail />} />
        <Route path="/playlist/:id" element={<PlaylistDetail />} />
      </Routes>
      <PlayerControls />
    </Router>
  );
}
