import ReactDOM from 'react-dom/client';
import React, { useState, useEffect } from 'react';
import { Settings, LogOut, Home, Building2, GraduationCap, ThumbsUp, Search, ArrowUpDown, X, Italic } from 'lucide-react';
// import ReplyComp from './ReplyComp';



const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [getrep, setgetrep] = useState('');
  const [getreplis, setgetreplis] = useState([]);
  const [forceupdate , setforceupdate]= useState(0);

  const[reloadinit,setreloadinit]= useState(0);
  const [toreply, settoreply] = useState('');

  const [currentThread, setCurrentThread] = useState('main');


  const [newPost, setNewPost] = useState({
    content: '',
    tripcode: ''
  });



  async function getData(Thread) {
    var url = "https://infinitylooper19.pythonanywhere.com/";
    url = url + Thread;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const json = await response.json();
      // console.log(json);
      return json
    } catch (error) {
      console.error(error.message);
    }
  }

  var initial_post;

  useEffect(() => {
    async function k(currentThread) {
      // console.log('j')
      initial_post = await getData(currentThread)
      console.log("ye ini data" + initial_post)
      setBlogs(initial_post);
      console.log(blogs);
    } k(currentThread);
  }, [currentThread,reloadinit]);

  // console.log('this is out',initial_post);
  var replies;
  useEffect(() => {

    async function k1(getrep) {
      var abort=false;
      getreplis.forEach(reply=>{
        if(reply.thread==getrep){
          abort=true;
          return;
        }
      })
      
      if(abort){
        console.log("show ho to gae reply dubara click kyu kar rah a hai")
        setgetreplis(getreplis.filter(reply => reply.thread !== getrep))

        return;
      }
      console.log("ye getrep hai " + getrep)
      console.log('reply clicked')
      replies = await getData(getrep)
      // console.log(initial_post)
      if (replies.length > 0) {
        console.log("ye updated getreplis " + getreplis);

        setgetreplis((prevState) => [...prevState, ...replies]);

      }


    } k1(getrep);
  }, [forceupdate]);


  // useEffect(() => {
  //   console.log(getreplis);

  //   getreplis.forEach((reply)=>{
  //     console.log(reply)
  //     if (reply){
  //       console.log('ye hai reply',reply)
  //       let a = document.getElementsByClassName(`${reply.thread}`)[0]
  //       console.log(a)

  //     if (a) {
  //       // Create a root for this reply
  //       const root = ReactDOM.createRoot(a);
  //       console.log(root)
  //       // Render the ReplyComponent into the target element
  //       root.render(<ReplyComp blog={reply} />);
  //       console.log('render ho gaya')
  //     }
  //     }


  //   })


  // }, [getreplis]);





  const ReplyComp = ({blog}) => {
    return (
      <div key={blog.id} style={{border:2 +"px solid white", borderRadius:10+"px" , margin:10+"px"}} className="bg-gray-800 rounded-lg p-6 border-gray-700">
              <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-5 h-5 bg-gray-700 overflow-hidden"></div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-green-500">Anonymous</h3>
                        <p className="text-sm text-gray-400">
                          {blog.tripcode} • {blog.timestamp}
                        </p>
                      </div>
                    </div>
                    
                    <p className="text-gray-300">{blog.content}</p>
                    
                    <div className="mt-4 flex items-center space-x-4">
                      <button onClick={()=>{setIsCreatePostOpen(true); settoreply(blog.tripcode)}} className="text-gray-400 hover:text-green-500 text-sm transition-colors duration-200">
                        Reply
                      </button>
                      <button
                      onClick={()=>{setgetrep(blog.tripcode); setforceupdate(prev => prev+1)}}
                      className="text-gray-400 hover:text-green-500 text-sm transition-colors duration-200">
                        Replies
                      </button>
                    </div>
                    <div className={`replies ${blog.tripcode}`}>
                    {getreplis.length > 0 &&
                        getreplis
                          .filter(reply => reply.thread === blog.tripcode) // Filter replies by thread
                          .map(reply => (
                            <div key={reply.id}>
                              <ReplyComp blog={reply} />
                            </div>
                          ))
                      }
                    </div>
                  </div>
                </div>
              </div>
    );
  };






  const handleCreatePost = () => {
    if (newPost.content.trim() === '' || newPost.tripcode.trim() === '') {
      alert('Please fill in both content and tripcode');
      return;
    }
    const newBlog = {
      thread: `${toreply}`,
      timestamp: new Date().toLocaleString(),
      content: newPost.content,
      tripcode: newPost.tripcode
    };
    console.log(newBlog)

    fetch('https://infinitylooper19.pythonanywhere.com/post', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newBlog)
    }).then(response => response.json()
    ).then(data => {
      console.log(data);
      alert(data.message);
      setreloadinit(prev => prev+1)

    })
    .catch(error => {
      console.error('Error:', error); 
    });

    // Reset form and close popup
    setNewPost({ content: '', tripcode: '' });
    setIsCreatePostOpen(false);
  };

  const filteredAndSortedBlogs = blogs
    .filter(blog =>
      // console.log(blog.content)
      blog.content.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.timestamp) - new Date(a.timestamp);
      }
      return 0;
    });

  return (
    <div className="min-h-screen bg-gray-900 maindiv relative">
      {/* Create Post Popup */}
      {isCreatePostOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          
          <div className="bg-gray-800 rounded-lg p-6 w-96 relative">
            <button
              onClick={() => setIsCreatePostOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500"
            >
              <X size={24} />
            </button>

            <h2 className="text-xl font-semibold text-green-500 mb-4">Create New Post</h2>

            <div className="mb-4">
            <div style={{}}>Posting in {`${toreply}`}</div>
            <br></br>
              <label className="block text-gray-300 mb-2">Content</label>
              <textarea
                className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-gray-100"
                rows="4"
                placeholder="Write your post here..."
                value={newPost.content}
                onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-300 mb-2">Tripcode</label>
              <input
                type="text"
                className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-gray-100"
                placeholder="Enter your tripcode"
                value={newPost.tripcode}
                onChange={(e) => setNewPost(prev => ({ ...prev, tripcode: e.target.value }))}
              />
              <p className="text-xs text-gray-400 mt-2">
                A tripcode is a unique identifier that allows you to consistently
                represent yourself without revealing your true identity. It's
                generated from a password you choose.
              </p>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={handleCreatePost}
                className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700 transition-colors"
              >
                Post
              </button>
              <button
                onClick={() => setIsCreatePostOpen(false)}
                className="flex-1 bg-gray-600 text-white py-2 rounded hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        className="plusbutton fixed bottom-6 right-6 z-40"
        onClick={() => {setIsCreatePostOpen(true); settoreply(currentThread)}}
      >
        <svg className='plus' fill="#22c55e" width="800px" height="800px" viewBox="0 0 24 24" version="1.2" baseProfile="tiny" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 10h-4v-4c0-1.104-.896-2-2-2s-2 .896-2 2l.071 4h-4.071c-1.104 0-2 .896-2 2s.896 2 2 2l4.071-.071-.071 4.071c0 1.104.896 2 2 2s2-.896 2-2v-4.071l4 .071c1.104 0 2-.896 2-2s-.896-2-2-2z" />
        </svg>
      </button>

      <nav className="bg-black text-gray-100 p-4 sticky top-0 z-50 border-b border-gray-800">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <div onClick={()=>{document.getElementsByClassName('options')[0].style.left=-24+'px'}} className="ham">
            <svg fill="#48bb78" width="24px" height="24px" viewBox="0 0 0.32 0.32" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><title>icn/menu</title><path d="M0.04 0.06h0.24a0.02 0.02 0 0 1 0 0.04H0.04a0.02 0.02 0 1 1 0 -0.04m0 0.08h0.24a0.02 0.02 0 0 1 0 0.04H0.04a0.02 0.02 0 1 1 0 -0.04m0 0.08h0.24a0.02 0.02 0 0 1 0 0.04H0.04a0.02 0.02 0 0 1 0 -0.04" id="a"/></svg>
            </div>
            <span className="text-xl font-bold text-green-500">UniChan</span>
            
            <div className="options flex ">
              <div onClick={()=>{document.getElementsByClassName('options')[0].style.left=-240+'px'}} className="close right-0 mx-2">
              <svg fill="#48bb78" width="24px" height="24px" viewBox="-6 -6 24 24" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin" class="jam jam-close"><path d='M7.314 5.9l3.535-3.536A1 1 0 1 0 9.435.95L5.899 4.485 2.364.95A1 1 0 1 0 .95 2.364l3.535 3.535L.95 9.435a1 1 0 1 0 1.414 1.414l3.535-3.535 3.536 3.535a1 1 0 1 0 1.414-1.414L7.314 5.899z' /></svg>
              </div>
              <button
                onClick={() => { setCurrentThread('main'); settoreply('main')}}
                className="flex mx-2 items-center space-x-1 hover:bg-gray-800 px-3 py-2 rounded transition-colors duration-200">
                <Home size={18} />
                <span>Home</span>

              </button>

              <button
                onClick={() => { setCurrentThread('hostels'); settoreply('hostels') }}
                className="flex mx-2 items-center space-x-1 hover:bg-gray-800 px-3 py-2 rounded transition-colors duration-200">
                <Building2 size={18} />
                <span>Hostels</span>
              </button>

              <button
                onClick={() => { setCurrentThread('department'); settoreply("department") }}
                className="flex mx-2 items-center space-x-1 hover:bg-gray-800 px-3 py-2 rounded transition-colors duration-200">
                <GraduationCap size={18} />
                <span>Departments</span>
              </button>
            </div>
          </div>

          
        </div>
      </nav>

      <main className="container mx-auto py-6 px-4">
        {/* Search and Sort Section */}
        <div className="mb-6 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search posts..."
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:border-green-500 transition-colors duration-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <ArrowUpDown size={18} className="text-gray-400" />
            </div>
            <select
              className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:border-green-500 transition-colors duration-200"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Newest</option>
            </select>
          </div>
        </div>

        {/* Posts Section */}
        <div className="space-y-4">
          {filteredAndSortedBlogs.map(blog => (
            <div key={blog.id} className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-colors duration-200 border border-gray-700">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-5 h-5 bg-gray-700 overflow-hidden"></div>
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-semibold text-green-500">Anonymous</h3>
                      <p className="text-sm text-gray-400">
                        {blog.tripcode} • {blog.timestamp}
                      </p>
                    </div>
                  </div>

                  <p className="text-gray-300">{blog.content}</p>

                  <div className="mt-4 flex items-center space-x-4">
                    <button
                    onClick={()=>{setIsCreatePostOpen(true);settoreply(blog.tripcode)}}
                    className="text-gray-400 hover:text-green-500 text-sm transition-colors duration-200">
                      Reply
                    </button>
                    <button
                      onClick={() => { setgetrep(blog.tripcode); setforceupdate(prev => prev+1) }}
                      className="text-gray-400 hover:text-green-500 text-sm transition-colors duration-200">
                      Replies
                    </button>
                  </div>
                  <div className={`replies ${blog.tripcode}`}>
                    {getreplis.length > 0 &&
                      getreplis
                        .filter(reply => reply.thread === blog.tripcode) // Filter replies by thread
                        .map(reply => (
                          <div key={reply.id}>
                            {/* Replace this with your ReplyComp or HTML */}
                            <ReplyComp blog={reply} />
                          </div>
                        ))
                    }




                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default App;