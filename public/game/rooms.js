/* Room Engine V2 - modular world blueprint.
   Edit room/object/NPC/quest data here without touching the renderer. */
window.SCHOOL_WORLD = {
  id: 'school-world',
  rooms: {
    halaman: {
      id:'halaman', name:'Halaman Sekolah', w:1800,h:1050,bg:'#79b96d', spawn:{x:420,y:520},
      style:'outdoor',
      collision:[
        {x:520,y:150,w:760,h:250},{x:1340,y:150,w:300,h:190},
        {x:260,y:730,w:430,h:210},{x:800,y:690,w:360,h:210}
      ],
      objects:[
        {id:'school',type:'building',x:520,y:150,w:760,h:250,emoji:'🏫',label:'Gedung Sekolah'},
        {id:'office',type:'building',x:1340,y:150,w:300,h:190,emoji:'🏢',label:'Kantor Sekolah'},
        {id:'board',type:'info',x:420,y:330,w:90,h:62,emoji:'📋',label:'Papan Informasi',text:'Selamat datang di sekolah. Periksa papan ini untuk informasi kegiatan.'},
        {id:'tree1',type:'decor',x:180,y:210,emoji:'🌳',scale:1.4},{id:'tree2',type:'decor',x:260,y:520,emoji:'🌳',scale:1.3},
        {id:'tree3',type:'decor',x:1500,y:520,emoji:'🌳',scale:1.3},{id:'garden',type:'info',x:1080,y:520,w:90,h:62,emoji:'🌷',label:'Taman Belajar',text:'Taman belajar. Quest sederhana dapat ditemukan di sini.'},
        {id:'portal_selasar',type:'portal',x:860,y:380,w:90,h:60,emoji:'🚪',label:'Masuk Selasar',targetRoom:'selasar',targetX:120,targetY:430},
        {id:'portal_lapangan',type:'portal',x:690,y:880,w:100,h:60,emoji:'🚪',label:'Ke Lapangan',targetRoom:'lapangan',targetX:120,targetY:420},
        {id:'quest_garden',type:'quest',x:1080,y:520,w:90,h:62,emoji:'🌼',label:'Quest Taman',questId:'pet_cat'},
        {id:'quiz_board',type:'quiz',x:1320,y:430,w:90,h:62,emoji:'❓',label:'Kuis Sekolah',quizId:'math1'}
      ],
      npcs:[
        {id:'npc_teacher1',sprite:'npc07',x:730,y:500,name:'Guru',behavior:'PATROL',path:[[700,500],[820,500],[820,580],[700,580]],speed:35},
        {id:'npc_cat1',sprite:'npc01',x:330,y:650,name:'Kucing',behavior:'WALK_RANDOM',speed:28},
        {id:'npc_dog1',sprite:'npc04',x:1450,y:650,name:'Anjing',behavior:'WALK_RANDOM',speed:30},
        {id:'npc_guard',sprite:'npc14',x:1390,y:300,name:'Satpam',behavior:'STAY'}
      ]
    },
    selasar: {
      id:'selasar',name:'Selasar',w:1500,h:820,bg:'#c9b989',spawn:{x:120,y:430},style:'corridor',collision:[
        {x:230,y:140,w:280,h:180},{x:600,y:140,w:280,h:180},{x:970,y:140,w:280,h:180}
      ],objects:[
        {id:'back_halaman',type:'portal',x:40,y:390,w:90,h:70,emoji:'🚪',label:'Ke Halaman',targetRoom:'halaman',targetX:900,targetY:440},
        {id:'class1',type:'portal',x:330,y:120,w:100,h:70,emoji:'🚪',label:'Kelas 1',targetRoom:'kelas1',targetX:140,targetY:430},
        {id:'class2',type:'portal',x:700,y:120,w:100,h:70,emoji:'🚪',label:'Kelas 2',targetRoom:'kelas2',targetX:140,targetY:430},
        {id:'library',type:'portal',x:1070,y:120,w:100,h:70,emoji:'🚪',label:'Perpustakaan',targetRoom:'perpustakaan',targetX:140,targetY:430},
        {id:'notice',type:'info',x:520,y:430,w:100,h:65,emoji:'📋',label:'Pengumuman',text:'Jaga kebersihan dan berjalan dengan tertib di selasar sekolah.'},
        {id:'stairs',type:'info',x:1240,y:430,w:100,h:65,emoji:'🪜',label:'Tangga',text:'Tangga modular. Ruang lantai atas dapat ditambahkan tanpa mengubah engine.'}
      ],
      npcs:[{id:'npc_teacher2',sprite:'npc08',x:850,y:500,name:'Guru',behavior:'PATROL',path:[[820,500],[1100,500]],speed:30}]
    },
    kelas1:{
      id:'kelas1',name:'Ruang Kelas 1',w:950,h:700,bg:'#ded6bb',spawn:{x:140,y:430},style:'classroom',collision:[{x:250,y:180,w:520,h:110},{x:250,y:380,w:520,h:110}],objects:[
        {id:'back1',type:'portal',x:35,y:380,w:85,h:80,emoji:'🚪',label:'Kembali',targetRoom:'selasar',targetX:380,targetY:220},
        {id:'teacherdesk',type:'info',x:500,y:115,w:100,h:65,emoji:'🪑',label:'Meja Guru',text:'Tempat guru mengajar. Interaksi NPC dapat dikembangkan menjadi quest.'},
        {id:'board1',type:'quiz',x:780,y:120,w:100,h:65,emoji:'📚',label:'Kuis Pelajaran',quizId:'math1'},
        {id:'book1',type:'info',x:170,y:180,w:70,h:60,emoji:'📚',label:'Buku',text:'Buku pelajaran tersedia di kelas.'}
      ],
      npcs:[{id:'npc_teacher3',sprite:'npc10',x:500,y:520,name:'Guru',behavior:'STAY'}]
    },
    kelas2:{
      id:'kelas2',name:'Ruang Kelas 2',w:950,h:700,bg:'#d3dfdf',spawn:{x:140,y:430},style:'classroom',collision:[{x:250,y:180,w:520,h:110},{x:250,y:380,w:520,h:110}],objects:[
        {id:'back2',type:'portal',x:35,y:380,w:85,h:80,emoji:'🚪',label:'Kembali',targetRoom:'selasar',targetX:750,targetY:220},
        {id:'lab',type:'info',x:500,y:115,w:100,h:65,emoji:'🧪',label:'Meja Praktik',text:'Tempat kegiatan praktik dan pembelajaran.'},
        {id:'quiz2',type:'quiz',x:780,y:120,w:100,h:65,emoji:'❓',label:'Kuis IPA',quizId:'ipa1'}
      ],
      npcs:[{id:'npc_teacher4',sprite:'npc07',x:500,y:520,name:'Guru',behavior:'STAY'}]
    },
    perpustakaan:{
      id:'perpustakaan',name:'Perpustakaan',w:1000,h:720,bg:'#cdbb9e',spawn:{x:140,y:430},style:'library',collision:[{x:240,y:150,w:190,h:400},{x:500,y:150,w:190,h:400}],objects:[
        {id:'backlib',type:'portal',x:35,y:380,w:85,h:80,emoji:'🚪',label:'Kembali',targetRoom:'selasar',targetX:1120,targetY:220},
        {id:'shelf1',type:'info',x:335,y:180,w:70,h:70,emoji:'📚',label:'Rak Buku',text:'Buku cerita dan buku pelajaran.'},
        {id:'shelf2',type:'info',x:595,y:180,w:70,h:70,emoji:'📚',label:'Rak Buku',text:'Pilih buku untuk membaca ringkasan pembelajaran.'},
        {id:'desk',type:'info',x:800,y:450,w:100,h:65,emoji:'🪑',label:'Meja Baca',text:'Tempat membaca dengan tenang.'}
      ],
      npcs:[{id:'npc_librarian',sprite:'npc18',x:800,y:300,name:'Penjaga',behavior:'STAY'}]
    },
    lapangan:{
      id:'lapangan',name:'Lapangan',w:1500,h:900,bg:'#65a85f',spawn:{x:120,y:420},style:'field',collision:[{x:1030,y:160,w:260,h:220}],objects:[
        {id:'backfield',type:'portal',x:35,y:380,w:85,h:80,emoji:'🚪',label:'Kembali',targetRoom:'halaman',targetX:740,targetY:840},
        {id:'court',type:'info',x:600,y:400,w:100,h:65,emoji:'🏀',label:'Lapangan Aktivitas',text:'Tempat olahraga dan minigame. Minigame dapat ditambahkan sebagai modul.'},
        {id:'petquest',type:'quest',x:900,y:550,w:100,h:65,emoji:'🐾',label:'Pet',questId:'pet_cat'}
      ],
      npcs:[{id:'npc_dog2',sprite:'npc05',x:400,y:600,name:'Anjing',behavior:'WALK_RANDOM',speed:32},{id:'npc_cat2',sprite:'npc02',x:760,y:620,name:'Kucing',behavior:'WALK_RANDOM',speed:25},{id:'npc_mob1',sprite:'npc22',x:1180,y:600,name:'Monster',behavior:'PATROL',path:[[1120,600],[1320,600]],speed:22}]
    }
  },
  quests:{
    pet_cat:{id:'pet_cat',title:'Teman Baru',description:'Temukan kucing di lingkungan sekolah dan dekati untuk menyelesaikan quest.',reward:'Pet Kucing (preview)',requiredNpc:'npc_cat1'}
  },
  quizzes:{
    math1:{id:'math1',title:'Kuis Matematika',questions:[{q:'Berapakah 2 + 3?',a:['4','5','6','7'],correct:1},{q:'Berapakah 5 - 2?',a:['2','3','4','5'],correct:1}]},
    ipa1:{id:'ipa1',title:'Kuis IPA',questions:[{q:'Bagian tumbuhan yang menyerap air dari tanah adalah...',a:['Akar','Bunga','Buah','Daun'],correct:0}]}
  }
};
