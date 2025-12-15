explorar peliculas:;


<!DOCTYPE html>

<html class="dark" lang="es"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Inicio / Explorar Películas</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Spline+Sans:wght@300;400;500;600;700&amp;family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    colors: {
                        "primary": "#ee4b2b",
                        "background-light": "#f8f6f6",
                        "background-dark": "#221310", // Dark reddish-brown/black
                        "glass-dark": "rgba(30, 20, 18, 0.70)",
                        "glass-border": "rgba(255, 255, 255, 0.1)",
                    },
                    fontFamily: {
                        "display": ["Spline Sans", "sans-serif"]
                    },
                    borderRadius: {"DEFAULT": "0.5rem", "lg": "1rem", "xl": "1.5rem", "2xl": "2rem", "full": "9999px"},
                    backdropBlur: {
                        'xs': '2px',
                    }
                },
            },
        }
    </script>
<style>
        .glass-panel {
            background: rgba(45, 30, 25, 0.4);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
        }
        .glass-panel-active {
            background: rgba(238, 75, 43, 0.85); /* Primary color glass */
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            box-shadow: 0 4px 30px rgba(238, 75, 43, 0.3);
        }
        .glass-input {
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .text-shadow {
            text-shadow: 0 2px 4px rgba(0,0,0,0.5);
        }
        /* Hide scrollbar for Chrome, Safari and Opera */
        .no-scrollbar::-webkit-scrollbar {
            display: none;
        }
        /* Hide scrollbar for IE, Edge and Firefox */
        .no-scrollbar {
            -ms-overflow-style: none;  /* IE and Edge */
            scrollbar-width: none;  /* Firefox */
        }
    </style>
<style>
    body {
      min-height: max(884px, 100dvh);
    }
  </style>
  </head>
<body class="bg-background-light dark:bg-background-dark font-display antialiased text-white selection:bg-primary selection:text-white pb-28">
<!-- Header Section -->
<header class="pt-6 px-5 pb-2 flex justify-between items-center z-20 relative">
<div class="flex items-center gap-3">
<div class="h-12 w-12 rounded-full bg-cover bg-center border-2 border-white/20" data-alt="Profile picture of a smiling young woman" style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuCu6gp_8MlAE2XnafT5hsZnApaDxLUO0YqHS2BIlD0KQlWvG7ueOpDl0gxmNiv39MgWnuWh_sMbz7KNiRu6tpgTPiMXZaR7Eulh5wEvrBIu4DPxVZddE5ZW9ssf6H66TLlcpbCStP3RuoT1LZC5s235qOxdm6Vre_1ZUnjDHtdzWAJL12PQ8rMfkOubOSZ6M_NK5YZy_YA839QXRbmFaSqXV6Fnvo3kmg1R34AbQJgtOQHDslByvZdK1b83g4fjsPiedx-VeTdEISU')"></div>
<div class="flex flex-col">
<span class="text-white/60 text-xs font-medium uppercase tracking-wider">Bienvenido</span>
<div class="flex items-center gap-1">
<span class="text-white text-lg font-bold">Alex Johnson</span>
<span class="material-symbols-outlined text-primary text-[18px] fill-1">verified</span>
</div>
</div>
</div>
<button class="glass-panel w-10 h-10 rounded-full flex items-center justify-center relative hover:bg-white/10 transition-colors">
<span class="material-symbols-outlined text-white text-[22px]">notifications</span>
<span class="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border border-[#221310]"></span>
</button>
</header>
<!-- Location & Search -->
<div class="px-5 mb-6 sticky top-0 z-10 py-2 transition-all duration-300">
<div class="flex flex-col gap-4">
<!-- Location (Small) -->
<div class="flex items-center gap-1 text-white/50 text-sm ml-1">
<span class="material-symbols-outlined text-[16px]">location_on</span>
<span>Cine Central, </span>
<span class="text-white font-medium underline decoration-primary decoration-2 underline-offset-4">Madrid</span>
</div>
<!-- Search Bar -->
<div class="relative w-full group">
<div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
<span class="material-symbols-outlined text-white/40 group-focus-within:text-primary transition-colors">search</span>
</div>
<input class="glass-input w-full py-3.5 pl-12 pr-12 rounded-2xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all text-sm font-medium" placeholder="Buscar películas, cines, actores..." type="text"/>
<div class="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer">
<span class="material-symbols-outlined text-white/40 hover:text-white transition-colors">tune</span>
</div>
</div>
</div>
</div>
<!-- Category Chips -->
<div class="flex gap-3 px-5 overflow-x-auto no-scrollbar pb-2 mb-4">
<button class="glass-panel-active px-5 py-2.5 rounded-xl shrink-0 flex items-center gap-2 transition-transform active:scale-95">
<span class="text-white text-sm font-semibold">En Cartelera</span>
</button>
<button class="glass-panel px-5 py-2.5 rounded-xl shrink-0 flex items-center gap-2 hover:bg-white/10 transition-all active:scale-95">
<span class="text-white/80 text-sm font-medium">Próximamente</span>
</button>
<button class="glass-panel px-5 py-2.5 rounded-xl shrink-0 flex items-center gap-2 hover:bg-white/10 transition-all active:scale-95">
<span class="text-white/80 text-sm font-medium">IMAX</span>
</button>
<button class="glass-panel px-5 py-2.5 rounded-xl shrink-0 flex items-center gap-2 hover:bg-white/10 transition-all active:scale-95">
<span class="text-white/80 text-sm font-medium">VIP</span>
</button>
<button class="glass-panel px-5 py-2.5 rounded-xl shrink-0 flex items-center gap-2 hover:bg-white/10 transition-all active:scale-95">
<span class="text-white/80 text-sm font-medium">Kids</span>
</button>
</div>
<!-- Featured Movie Hero -->
<div class="px-5 mb-8">
<div class="flex justify-between items-end mb-4 px-1">
<h2 class="text-2xl font-bold text-white tracking-tight">Destacado</h2>
<a class="text-primary text-sm font-semibold mb-1" href="#">Ver todo</a>
</div>
<div class="relative w-full aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl group">
<!-- Background Image -->
<img alt="Poster of a futuristic sci-fi movie with neon lights and a mysterious figure" class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" data-alt="Dune Part Two movie poster atmosphere" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDCIm9nVQ0tj_QJARW8ELwJQyyewDsOwDbzVoD0N3YNGdIpExkNK58Wn4ksUQeyXn4D77NA1idFeejtCl5JSNQxJYwz3YpLeMT_pnBLIMImtpkmCgnXvgds0I4saeDg0QNQle-wxOQDwbo1B1PPDTuzIQMLCX7pTRMEPUT1oMBBj4S-AnPiDSgN6M3Ak1L0N-gcLphSm8gyJxsC_bKlBg4lQPXnK_uLTQw4lvxRlpJOdyFtVId_SdBo_pdArpWFjcx5gxdYlUCmroQ"/>
<!-- Gradient Overlay -->
<div class="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-transparent opacity-90"></div>
<!-- Play Button (Centered) -->
<div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
<button class="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 hover:scale-110 transition-transform">
<span class="material-symbols-outlined text-white text-4xl fill-1 ml-1">play_arrow</span>
</button>
</div>
<!-- Glass Info Card -->
<div class="absolute bottom-4 left-4 right-4 glass-panel rounded-2xl p-4">
<div class="flex justify-between items-start">
<div>
<div class="flex items-center gap-2 mb-1">
<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-white/20 text-white uppercase tracking-wider backdrop-blur-sm">Sci-Fi</span>
<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-primary text-white uppercase tracking-wider shadow-lg shadow-primary/40">IMAX</span>
</div>
<h3 class="text-xl font-bold text-white leading-tight mb-1">Dune: Parte Dos</h3>
<div class="flex items-center gap-3 text-xs text-white/70">
<div class="flex items-center gap-1">
<span class="material-symbols-outlined text-yellow-400 text-sm fill-1">star</span>
<span class="text-white font-medium">8.9</span>
</div>
<span>•</span>
<span>2h 46m</span>
</div>
</div>
<button class="bg-primary hover:bg-red-600 text-white p-3 rounded-xl shadow-lg shadow-primary/30 transition-colors active:scale-95">
<span class="material-symbols-outlined block">local_activity</span>
</button>
</div>
</div>
</div>
</div>
<!-- Now Playing List (Vertical Glass Cards) -->
<div class="px-5 mb-8">
<h2 class="text-xl font-bold text-white mb-4 px-1">En Cartelera</h2>
<div class="flex flex-col gap-4">
<!-- Card 1 -->
<div class="glass-panel rounded-2xl p-3 flex gap-4 hover:bg-white/5 transition-colors group cursor-pointer">
<div class="relative w-24 aspect-[2/3] rounded-xl overflow-hidden shrink-0">
<img alt="Kung Fu Panda movie poster style illustration" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" data-alt="Kung Fu Panda 4 poster art" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAyn7RtcClPCut6HaSofjf_iAQm1esOzkqhfOKTwD3odbKvGrNuKjlxyG7XORhUfGO6jOhQYdWh3ZoC3VGE1rVyFiR7IriQwgKwEbXXB0e9YPhEuUng0J7MDwFtCLrbsI-x2UOuxj8s0uaX8WF-IoneTzxLRorv3lOHmi03gdfW7UsSw-OEIwkGQwl6glAa2tlc7bsuuNFQQL3yqNOGhexh9ZGs6ML7DaSrVDQBsxikjqk9uUgmSdOhbEaCIn1fdtgqlFmoUIQ1NYI"/>
</div>
<div class="flex flex-col justify-between flex-1 py-1">
<div>
<h3 class="text-lg font-bold text-white mb-1">Kung Fu Panda 4</h3>
<p class="text-white/50 text-xs line-clamp-2 leading-relaxed">Po debe entrenar a un nuevo guerrero mientras enfrenta a una hechicera camaleónica.</p>
</div>
<div class="flex items-center justify-between mt-3">
<div class="flex gap-2">
<span class="px-2 py-1 rounded-lg bg-white/5 border border-white/5 text-[10px] text-white/80">16:30</span>
<span class="px-2 py-1 rounded-lg bg-white/5 border border-white/5 text-[10px] text-white/80">19:00</span>
</div>
<div class="flex -space-x-2">
<img alt="Viewer avatar" class="w-6 h-6 rounded-full border border-background-dark" data-alt="User avatar 1" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBY6dUDr_RwuEvnIE7nOziL_CtYcwT889rE5zUVY20nRqZ5YFTQ_ei6HXMFl2jK5EfXXK4JGcpbcjCcwV4eLxXcWDZSse82wNGryYv096JU53RLaFoqF2tYMGmZS6LupSbwVhuhkQgK6oLlIikwEZYxsxBQEaggdBJFU62YbHE7ssFVIXvfN36uLqFAZ9Mhlb77MBQfWnHYyKxO413Xav_q4-u2s1BZNDtsgIu_exPUe5xRLoZiMBndiTdlYfqa0HlDc6lZ9yXOZ88"/>
<img alt="Viewer avatar" class="w-6 h-6 rounded-full border border-background-dark" data-alt="User avatar 2" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBbtZZf56gsDnK9cu5Kfw57ebgKqkAhutFobo1R3oEP24lRtq2RK17kN0HrgfrjYokcrTgabNvQdCFcJHeIyJuIaHS76L9T5E0s_WUsr5DbE124hbU74x6n4KOVlGyAxvQtJKVLtqCwMmDT_1Ro1Kx-jK-Lcz3OAKg3pdYijMTkCE4KrHAvnhjHujuxjpX7s2SdM9MakCdQeEkudRTiLjmby9c0JIAjJeO1xCD2rUJLeHBOHNkl_iEednVgCJ4ylZ3IHyetjURxt58"/>
<div class="w-6 h-6 rounded-full border border-background-dark bg-primary flex items-center justify-center text-[8px] font-bold">+12</div>
</div>
</div>
</div>
</div>
<!-- Card 2 -->
<div class="glass-panel rounded-2xl p-3 flex gap-4 hover:bg-white/5 transition-colors group cursor-pointer">
<div class="relative w-24 aspect-[2/3] rounded-xl overflow-hidden shrink-0">
<img alt="Godzilla vs Kong movie poster style giant monster" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" data-alt="Godzilla x Kong poster art" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAI-xXhCIPO9qdWqsks3V17rcyPOc02mwZhtPaHzUzOvSpEduK8EAjf9EBic4kra0JawQi3y7OhRLFXLuRrwjGQw8Lg9JYzEl0MiFxHGBFYDGZz6m424Sqs-B213yM8SvFnIGr_xDVEjpY9FBi5a0Irdk3hymM9Pm8XuiVD-A1ayR28mR6_RvLdDO8v1mESMaoor9LSfZl5nq3yL1o8TiCZGgIZUJPzHSv7eHREU_emmRWKESoOsSzwmq0udLeJduf4v0K3m-vleoU"/>
<div class="absolute top-1 right-1 bg-primary text-white text-[8px] font-bold px-1.5 py-0.5 rounded">3D</div>
</div>
<div class="flex flex-col justify-between flex-1 py-1">
<div>
<h3 class="text-lg font-bold text-white mb-1">Godzilla y Kong</h3>
<p class="text-white/50 text-xs line-clamp-2 leading-relaxed">Una batalla épica de titanes que amenaza la existencia del planeta.</p>
</div>
<div class="flex items-center justify-between mt-3">
<div class="flex gap-2">
<span class="px-2 py-1 rounded-lg bg-white/5 border border-white/5 text-[10px] text-white/80">18:15</span>
<span class="px-2 py-1 rounded-lg bg-white/5 border border-white/5 text-[10px] text-white/80">21:45</span>
</div>
<div class="text-primary text-xs font-semibold flex items-center gap-1">
                            Reservar <span class="material-symbols-outlined text-sm">arrow_forward</span>
</div>
</div>
</div>
</div>
<!-- Card 3 -->
<div class="glass-panel rounded-2xl p-3 flex gap-4 hover:bg-white/5 transition-colors group cursor-pointer">
<div class="relative w-24 aspect-[2/3] rounded-xl overflow-hidden shrink-0">
<img alt="Ghostbusters movie poster style car" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" data-alt="Ghostbusters poster art" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAIqSpI7is0osumkBaIQ48JLftcYv_kyW8G_L5LSiB8om6Y4fjCQTmNjgjKUCWTMoS8EcxPUDJ1pnUH5_qqDc6Btvc4T-v7Gp8IYa0lmAVy-dj2BxqIr9F2TybEZqY9VYT-HWuwmaWjMM2E-Ds8T27iP5C-5MQJAsYKZ1vO8LW1CmDCMxpoGN6X1h9PXB5Y4th2m7kuknUttPWT_OQNz-4YeS2U_q4fMEvYD0YgTiF8hIJSF2oCXj8SK5AdNgwY0_rVHo6J3GAhPWs"/>
</div>
<div class="flex flex-col justify-between flex-1 py-1">
<div>
<h3 class="text-lg font-bold text-white mb-1">Ghostbusters: I.H.</h3>
<p class="text-white/50 text-xs line-clamp-2 leading-relaxed">La familia Spengler regresa al lugar donde empezó todo para formar equipo.</p>
</div>
<div class="flex items-center justify-between mt-3">
<div class="flex gap-2">
<span class="px-2 py-1 rounded-lg bg-white/5 border border-white/5 text-[10px] text-white/80">14:00</span>
<span class="px-2 py-1 rounded-lg bg-white/5 border border-white/5 text-[10px] text-white/80">17:30</span>
</div>
</div>
</div>
</div>
</div>
</div>
<!-- Coming Soon Carousel -->
<div class="mb-6">
<h2 class="text-xl font-bold text-white mb-4 px-5">Próximamente</h2>
<div class="flex overflow-x-auto no-scrollbar gap-4 px-5 pb-4">
<!-- Item 1 -->
<div class="flex flex-col gap-2 shrink-0 w-32">
<div class="w-full aspect-[2/3] rounded-xl overflow-hidden relative group">
<img alt="Civil War movie aesthetic poster" class="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" data-alt="Civil War poster" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDCbOyArEIBaulwu_OZ7GUGKM3WM0OdNx5t1AobUJxWf07f7H0TF6tl9O6LufSOnkPMjBxws3bxO7nahJsUrinIX7fyXHVz__ePmkffWWjPbN_XaAj2VXLKsS6biRCQx9a3I91SyOf6Jxa78N3PDCqAHZ5tkPARKb2J1ZfhzAv_96VPyGhRrKoP-dP9S3OMKlARVvHyMckdLmaKdgK6N2W7geCIJikmwNRWAPVInkQsfZfxUnw06VYpVMkb5vLOmbucz6RLeTedXSI"/>
<div class="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
<div class="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] text-white font-bold">18 ABR</div>
</div>
<p class="text-white text-sm font-medium truncate">Civil War</p>
</div>
<!-- Item 2 -->
<div class="flex flex-col gap-2 shrink-0 w-32">
<div class="w-full aspect-[2/3] rounded-xl overflow-hidden relative group">
<img alt="Challengers movie aesthetic poster tennis" class="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" data-alt="Challengers poster" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCWtOTn_o_tB8ruLXsamh4poK317x5Kh_nT9k8iFVmhKAyiQPItU0yCcuJHREDd5DdjZEv27NAtyT9WMxNPicF-4zxFA65MLXJb6DPYjhwKBiB8XnrvslLNCK4IvzGlCxfumLoVmutUrZRVLbXCxOwxKi8Xe8r-Tp6WQQFRH2aDl3YEms5VzR1RW0_m4ZItv64fYVfadTBtV6uGc9tpGntbYCCxTAmT_sObdIdwVUspMfwXaCphayG5gSAZswAeNkeVNlbOPPwO7Vc"/>
<div class="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
<div class="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] text-white font-bold">25 ABR</div>
</div>
<p class="text-white text-sm font-medium truncate">Desafiantes</p>
</div>
<!-- Item 3 -->
<div class="flex flex-col gap-2 shrink-0 w-32">
<div class="w-full aspect-[2/3] rounded-xl overflow-hidden relative group">
<img alt="Spiderman movie aesthetic poster" class="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" data-alt="Spiderman poster" src="https://lh3.googleusercontent.com/aida-public/AB6AXuACRMB09LeYsgFKvqr0rpzKJNq6jjHQcCWnJh0gutCcPZaHeAlFdOZiAG14JHnSkHnzmgrO_xydg-ZfH_l2sFGTDUn0M4DGe8AhimBU1oqmU9NM9HHZykqknFdWt6jheVeuP4zYp5_4OkLLnHNKhjV8EYFABxvd-LMcImy1o2GFENJ6lv1yfej1AaBZ_UAyU-jhiHENGjh6yHy18c-ZLMVb6Uibn9T25J0Jefhl7qUehqLEpuYs-VuaKW8RzqvRWI-E9Bo9uO_ZPUY"/>
<div class="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
<div class="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] text-white font-bold">2 MAY</div>
</div>
<p class="text-white text-sm font-medium truncate">Spider-Man: R.</p>
</div>
<!-- Item 4 -->
<div class="flex flex-col gap-2 shrink-0 w-32">
<div class="w-full aspect-[2/3] rounded-xl overflow-hidden relative group">
<img alt="Abstract movie poster colors" class="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" data-alt="Furiosa poster" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAfQYNNIegpSx9F5sp6Ac0a7ro1Z2oJTLAEr8sBQkgROpFgfuzdyjr50cHyPCwFcNPomM_4CJv_BYmmDruukE_ao7Ft38owmxxzIHrCnhNWftvuHVtLtN9PV8QOMH1BeljrD_nyayxFWDajasmvsp-PljP6Rj1U0eFttMnZPEbn9JNOQvZcQWjfYQgZgzkpa7-pG18fnnV_IYMrVOrocvnrAzUpzDSzRbWUaULa5Oe30_9WWoNpGjd7RHQhDQgdbr8zlgMLu4vFqdU"/>
<div class="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
<div class="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] text-white font-bold">23 MAY</div>
</div>
<p class="text-white text-sm font-medium truncate">Furiosa</p>
</div>
</div>
</div>
<!-- Floating Bottom Navigation -->
<div class="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-4">
<nav class="glass-panel w-full rounded-2xl px-6 py-4 flex justify-between items-center shadow-2xl shadow-black/50">
<a class="flex flex-col items-center gap-1 group" href="#">
<span class="material-symbols-outlined text-primary text-[26px] transition-transform group-hover:-translate-y-1">home</span>
<span class="w-1 h-1 rounded-full bg-primary block"></span>
</a>
<a class="flex flex-col items-center gap-1 group" href="#">
<span class="material-symbols-outlined text-white/50 text-[26px] group-hover:text-white transition-colors group-hover:-translate-y-1">confirmation_number</span>
<span class="w-1 h-1 rounded-full bg-transparent block"></span>
</a>
<!-- Center Action Button -->
<a class="relative -top-8" href="#">
<div class="w-14 h-14 bg-primary rounded-full flex items-center justify-center shadow-lg shadow-primary/40 border-4 border-background-dark transform transition-transform hover:scale-105 active:scale-95">
<span class="material-symbols-outlined text-white text-[28px]">search</span>
</div>
</a>
<a class="flex flex-col items-center gap-1 group" href="#">
<span class="material-symbols-outlined text-white/50 text-[26px] group-hover:text-white transition-colors group-hover:-translate-y-1">fastfood</span>
<span class="w-1 h-1 rounded-full bg-transparent block"></span>
</a>
<a class="flex flex-col items-center gap-1 group" href="#">
<span class="material-symbols-outlined text-white/50 text-[26px] group-hover:text-white transition-colors group-hover:-translate-y-1">person</span>
<span class="w-1 h-1 rounded-full bg-transparent block"></span>
</a>
</nav>
</div>
<!-- Background Decorative Elements (Blobs) -->
<div class="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
<div class="absolute -top-[10%] -left-[10%] w-[50%] h-[40%] rounded-full bg-primary/10 blur-[100px]"></div>
<div class="absolute top-[20%] -right-[10%] w-[60%] h-[50%] rounded-full bg-blue-900/10 blur-[120px]"></div>
<div class="absolute bottom-[10%] left-[20%] w-[40%] h-[40%] rounded-full bg-purple-900/10 blur-[100px]"></div>
</div>
</body></html>

-------

detalles pelicula:


<!DOCTYPE html>

<html class="dark" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Movie Details</title>
<link href="https://fonts.googleapis.com/css2?family=Spline+Sans:wght@300;400;500;600;700&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    colors: {
                        "primary": "#ee4b2b",
                        "background-light": "#f8f6f6",
                        "background-dark": "#221310",
                    },
                    fontFamily: {
                        "display": ["Spline Sans", "sans-serif"]
                    },
                    borderRadius: {"DEFAULT": "0.5rem", "lg": "1rem", "xl": "1.5rem", "full": "9999px"},
                },
            },
        }
    </script>
<style>
        .no-scrollbar::-webkit-scrollbar {
            display: none;
        }
        .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
        /* Custom Liquid Glass Effect */
        .glass-panel {
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.08);
            box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
        }
        .glass-card-active {
            background: rgba(238, 75, 43, 0.2);
            border: 1px solid rgba(238, 75, 43, 0.5);
        }
    </style>
<style>
    body {
      min-height: max(884px, 100dvh);
    }
  </style>
  </head>
<body class="bg-background-light dark:bg-background-dark font-display min-h-screen relative overflow-x-hidden text-white">
<!-- Background Ambient Glow -->
<div class="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
<div class="absolute top-[-10%] right-[-20%] w-[500px] h-[500px] rounded-full bg-primary/20 blur-[100px] mix-blend-screen"></div>
<div class="absolute bottom-[-10%] left-[-20%] w-[400px] h-[400px] rounded-full bg-blue-500/10 blur-[120px] mix-blend-screen"></div>
</div>
<!-- Main Scrollable Container -->
<div class="relative z-10 flex flex-col min-h-screen pb-24">
<!-- Hero Section with Image & Nav -->
<div class="relative w-full h-[55vh]">
<!-- Navigation Overlay -->
<div class="absolute top-0 left-0 w-full z-20 p-4 pt-12 flex items-center justify-between bg-gradient-to-b from-black/60 to-transparent">
<button class="glass-panel p-3 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors">
<span class="material-symbols-outlined text-white">arrow_back</span>
</button>
<div class="flex gap-3">
<button class="glass-panel p-3 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors">
<span class="material-symbols-outlined text-white">share</span>
</button>
<button class="glass-panel p-3 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors">
<span class="material-symbols-outlined text-white">favorite</span>
</button>
</div>
</div>
<!-- Hero Image -->
<div class="w-full h-full bg-cover bg-center bg-no-repeat relative" data-alt="Dark moody cinematic movie poster background with desert tones" style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuAytwV1p6nBVRhSaBEZtcYH8mkmGfswRq5Y3prhSDpG9h1TpE-U3uV1ib-081N5WYCCGNNp_JBkiQSPPZiRV7Vx5AgqH_Cg3DSmcheSBNgmJfyzZ22J5r8XPLQVzIf2D56bfnvY4vkzqNz9RV1hLWT7y-gDN5vNw-_uGalFRCtT1gGhDuyuK0iNuIrPdA7U1tBCceUVFb_C-WCXl9E7RKX3ez0SFTBl9Lvr4te5Ok554ofivts2z8C_USUzOT-Gr5B0pD6ZYuz4Bcw');">
<div class="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/40 to-transparent"></div>
</div>
</div>
<!-- Movie Details Content -->
<div class="px-5 -mt-20 flex flex-col gap-6">
<!-- Title Block -->
<div class="flex flex-col gap-2">
<h1 class="text-4xl font-bold leading-tight tracking-tight text-white drop-shadow-lg">Dune: Parte Dos</h1>
<p class="text-gray-300 text-sm font-medium tracking-wide">CIENCIA FICCIÓN • AVENTURA</p>
</div>
<!-- Glass Stats Row -->
<div class="glass-panel rounded-2xl p-4 flex items-center justify-between divide-x divide-white/10">
<div class="flex flex-col items-center gap-1 px-4 flex-1">
<div class="flex items-center text-primary">
<span class="material-symbols-outlined text-[20px] fill-1">star</span>
<span class="text-lg font-bold ml-1 text-white">4.8</span>
</div>
<span class="text-xs text-gray-400">1.2k reseñas</span>
</div>
<div class="flex flex-col items-center gap-1 px-4 flex-1">
<span class="text-lg font-bold">2h 46m</span>
<span class="text-xs text-gray-400">Duración</span>
</div>
<div class="flex flex-col items-center gap-1 px-4 flex-1">
<span class="text-lg font-bold border border-white/20 rounded px-1.5 py-0.5 text-xs">PG-13</span>
<span class="text-xs text-gray-400">Clasificación</span>
</div>
</div>
<!-- Tabs -->
<div class="flex gap-6 border-b border-white/10 pb-1">
<button class="pb-3 border-b-2 border-primary text-white font-semibold text-base transition-all">Sinopsis</button>
<button class="pb-3 border-b-2 border-transparent text-gray-400 hover:text-white font-medium text-base transition-all">Elenco</button>
<button class="pb-3 border-b-2 border-transparent text-gray-400 hover:text-white font-medium text-base transition-all">Reseñas</button>
</div>
<!-- Synopsis Text -->
<p class="text-gray-300 text-sm leading-relaxed font-light">
                Paul Atreides se une a Chani y a los Fremen en un viaje espiritual y marcial para vengarse de los conspiradores que destruyeron a su familia. Ante la elección entre el amor de su vida y el destino del universo conocido, se esfuerza por evitar un futuro terrible.
            </p>
<!-- Cast Section -->
<div class="flex flex-col gap-3">
<h3 class="text-white font-semibold text-lg">Elenco Principal</h3>
<div class="flex gap-4 overflow-x-auto no-scrollbar pb-2">
<!-- Actor 1 -->
<div class="flex flex-col items-center gap-2 min-w-[72px]">
<div class="w-[72px] h-[72px] rounded-full overflow-hidden border-2 border-white/10 relative" data-alt="Portrait of Timothée Chalamet">
<img alt="Actor face" class="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCtLh2CPsGDqoTL_rHcDZpnv486Lvp0mtQNHL8RpScNkkcOxrY1JSKS01J0eJK1tYhWLzy5D_yqCUXhLoUt_O6tWBeso9lwrjXwT6RJhPgwHv-fy2Vh5xnFLxkC-l4-LQdFq5yAP5oJkTVonnV0RgY5dc1FlMh22WtAXEJO2vdb_GWWGHQBf_8zdFUDI1D9lrVUOAXnzb5eDuKmv0lHcJH100vusWLgXam0oVGvUAfjI4xYML3aqaRe17epj4tbeB7d92jZnHz53bs"/>
</div>
<span class="text-xs text-center text-gray-300 w-full truncate">Timothée</span>
</div>
<!-- Actor 2 -->
<div class="flex flex-col items-center gap-2 min-w-[72px]">
<div class="w-[72px] h-[72px] rounded-full overflow-hidden border-2 border-white/10 relative" data-alt="Portrait of Zendaya">
<img alt="Actress face" class="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB_Lh-QAiCVdafyb6b15-AVfT-rz0UacI-3cb_QUC4uS46Y9j3gXz-yiKNRrNafCkm-WFRMvCeOx7YmGX3t1xmFDlRiXsckyXmjBC6m25khZa-DpfwMios1fBuXvJMrv0oCggGWkwRIewzS6ghF8y4WJuKXvT7XjvSjcbdIWaPFJG3Lai7Jl26dZTXLgUm8mSHeIAUAdh57oN8iRjI6CkTMHbRN2-JkK9Fl2lUCmWZYJmt5-PkqmV_o0e1YOu5cNP2wskE4LXs1Wkg"/>
</div>
<span class="text-xs text-center text-gray-300 w-full truncate">Zendaya</span>
</div>
<!-- Actor 3 -->
<div class="flex flex-col items-center gap-2 min-w-[72px]">
<div class="w-[72px] h-[72px] rounded-full overflow-hidden border-2 border-white/10 relative" data-alt="Portrait of Rebecca Ferguson">
<img alt="Actress face" class="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCoy6fBJjr_24BFQj-Zuf5ynGdT-D3vB8BGH23ryHNZmuln9o8UzWQF_8-E9ePCW7gsAwXN3x-MaxT_htdytWkEcj2iEbFdhnibx-Xa_rIKYM3ffVNVa3Fa-hhPzNs2WpuHSWpEh6oJRSKmN48c8hgFkWGKbynjhuu8kY3g3gEyjdqo-wfuTqk_3UDA1lOMNMiK7Ofxatzx2Am5UMtgarNB4tIn4n5zPrakXUefBd4eeH_wyrfSH8jlXLxRd_SQR7lNxKyhFWkaNEs"/>
</div>
<span class="text-xs text-center text-gray-300 w-full truncate">Rebecca</span>
</div>
<!-- Actor 4 -->
<div class="flex flex-col items-center gap-2 min-w-[72px]">
<div class="w-[72px] h-[72px] rounded-full overflow-hidden border-2 border-white/10 relative" data-alt="Portrait of Austin Butler">
<img alt="Actor face" class="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCvz27ayoN_9qudM9888YxFqSgbDDKZF0pfQnRC_umfeU6C4MFGMhctBoXAksK4wNlwDtDVRPs3zJ9NWgaMKUqAlrUyFEjbtVowFWnymJSlnvV2I3yEqO7jwUNriHputQWff9UC03Br01uQj2-1AP98DCSMAsPmfRH1Zf4VpqDpS6IlC5gwYEeEYnf89o5Ol10JlOkUmPrB2D5MdJZGgG-Pdq4pplki76C7733QPsDG49Yg5iwLvUDABUWBYkHhoTdzenpIkxu_mAE"/>
</div>
<span class="text-xs text-center text-gray-300 w-full truncate">Austin</span>
</div>
<!-- Actor 5 -->
<div class="flex flex-col items-center gap-2 min-w-[72px]">
<div class="w-[72px] h-[72px] rounded-full overflow-hidden border-2 border-white/10 relative" data-alt="Portrait of Florence Pugh">
<img alt="Actress face" class="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAa7LxfZ90R0NQ8bC2S0jHM5UW7QpEdrHntbmepMb4nFo9k1mi52DLb1bXghD2sUB3SET96JO25Ml-lGEi-dCWRGTrWH6Qp3Zjt-CFMGW2S-M5mVgsPPwZy8u-Q7mQxMJLX2vbhn2G8s9QOD_fUOn8hNVK8yHiZMkMKftc4CuYRxG89tB6r9YBnJbFSc5vfUnK6z8cqqhHU63b6My0K_NjFijU0WD9D1AMTCUZsoUPVo19meeWPg22USwxYKNmg7wk83ma6R64fgk0"/>
</div>
<span class="text-xs text-center text-gray-300 w-full truncate">Florence</span>
</div>
</div>
</div>
<!-- Date Selector -->
<div class="flex flex-col gap-3">
<h3 class="text-white font-semibold text-lg">Fecha</h3>
<div class="flex gap-3 overflow-x-auto no-scrollbar">
<button class="glass-panel glass-card-active min-w-[60px] h-[70px] rounded-xl flex flex-col items-center justify-center gap-1 shrink-0">
<span class="text-xs font-medium text-white/80">Hoy</span>
<span class="text-lg font-bold text-white">12</span>
</button>
<button class="glass-panel min-w-[60px] h-[70px] rounded-xl flex flex-col items-center justify-center gap-1 shrink-0 hover:bg-white/5 transition-colors">
<span class="text-xs font-medium text-gray-400">Mar</span>
<span class="text-lg font-bold text-gray-300">13</span>
</button>
<button class="glass-panel min-w-[60px] h-[70px] rounded-xl flex flex-col items-center justify-center gap-1 shrink-0 hover:bg-white/5 transition-colors">
<span class="text-xs font-medium text-gray-400">Mié</span>
<span class="text-lg font-bold text-gray-300">14</span>
</button>
<button class="glass-panel min-w-[60px] h-[70px] rounded-xl flex flex-col items-center justify-center gap-1 shrink-0 hover:bg-white/5 transition-colors">
<span class="text-xs font-medium text-gray-400">Jue</span>
<span class="text-lg font-bold text-gray-300">15</span>
</button>
<button class="glass-panel min-w-[60px] h-[70px] rounded-xl flex flex-col items-center justify-center gap-1 shrink-0 hover:bg-white/5 transition-colors">
<span class="text-xs font-medium text-gray-400">Vie</span>
<span class="text-lg font-bold text-gray-300">16</span>
</button>
</div>
</div>
<!-- Time Selector -->
<div class="flex flex-col gap-3 pb-6">
<h3 class="text-white font-semibold text-lg">Horario</h3>
<div class="flex flex-wrap gap-3">
<button class="glass-panel px-5 py-2.5 rounded-lg border border-white/10 text-gray-300 text-sm font-medium hover:bg-white/5">16:30</button>
<button class="bg-primary text-white shadow-[0_0_15px_rgba(238,75,43,0.5)] px-5 py-2.5 rounded-lg text-sm font-bold border border-primary">19:00</button>
<button class="glass-panel px-5 py-2.5 rounded-lg border border-white/10 text-gray-300 text-sm font-medium hover:bg-white/5">21:45</button>
<button class="glass-panel px-5 py-2.5 rounded-lg border border-white/10 text-gray-300 text-sm font-medium hover:bg-white/5">23:15</button>
</div>
</div>
</div>
</div>
<!-- Sticky Bottom Action Bar (Liquid Glass) -->
<div class="fixed bottom-0 left-0 w-full p-4 z-50">
<div class="glass-panel rounded-2xl p-4 flex items-center justify-between shadow-2xl backdrop-blur-xl bg-background-dark/80 supports-[backdrop-filter]:bg-background-dark/30">
<div class="flex flex-col">
<span class="text-gray-400 text-xs font-medium uppercase tracking-wide">Precio Total</span>
<span class="text-2xl font-bold text-white">$24.00</span>
</div>
<button class="bg-primary hover:bg-red-600 text-white font-bold py-3 px-8 rounded-xl shadow-[0_4px_20px_rgba(238,75,43,0.4)] transition-all transform active:scale-95 flex items-center gap-2">
<span>Comprar Entradas</span>
<span class="material-symbols-outlined text-[20px]">confirmation_number</span>
</button>
</div>
</div>
</body></html>

------

seleccion asientos:


<!DOCTYPE html>

<html class="dark" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Cinema Seat Selection</title>
<!-- Tailwind CSS -->
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<!-- Fonts & Icons -->
<link href="https://fonts.googleapis.com/css2?family=Spline+Sans:wght@300;400;500;600;700&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<!-- Tailwind Config -->
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    colors: {
                        "primary": "#ee4b2b",
                        "background-light": "#f8f6f6",
                        "background-dark": "#221310",
                    },
                    fontFamily: {
                        "display": ["Spline Sans", "sans-serif"]
                    },
                    borderRadius: {"DEFAULT": "0.5rem", "lg": "1rem", "xl": "1.5rem", "full": "9999px"},
                },
            },
        }
    </script>
<style>
        /* Hide scrollbar for cleaner look */
        .no-scrollbar::-webkit-scrollbar {
            display: none;
        }
        .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }

        /* Seat Shapes & Transitions */
        .seat {
            height: 2.25rem;
            width: 2.25rem;
            border-top-left-radius: 0.75rem;
            border-top-right-radius: 0.75rem;
            border-bottom-left-radius: 0.5rem;
            border-bottom-right-radius: 0.5rem;
            transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
            position: relative;
        }

        .seat::after {
            content: '';
            position: absolute;
            top: 2px;
            left: 2px;
            right: 2px;
            height: 40%;
            background: linear-gradient(180deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 100%);
            border-radius: 0.5rem;
            opacity: 0;
            transition: opacity 0.3s ease;
        }

        /* Selected State - Liquid Glass Effect */
        .seat-selected {
            background: linear-gradient(135deg, #ff7a5c 0%, #ee4b2b 100%);
            box-shadow: 
                0 0 15px rgba(238, 75, 43, 0.4),
                inset 0 1px 1px rgba(255, 255, 255, 0.4);
            border: 1px solid rgba(255,255,255,0.2);
            transform: scale(1.05);
        }
        
        .seat-selected::after {
            opacity: 1;
        }

        /* Glassmorphism Panel */
        .glass-panel {
            background: rgba(34, 19, 16, 0.65);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border-top: 1px solid rgba(255, 255, 255, 0.08);
        }

        /* Animation for the CTA button shimmer */
        @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
        }
        .animate-shimmer {
            animation: shimmer 2s infinite;
        }
    </style>
<style>
    body {
      min-height: max(884px, 100dvh);
    }
  </style>
  </head>
<body class="bg-background-light dark:bg-background-dark font-display text-white overflow-hidden h-screen w-full flex flex-col selection:bg-primary selection:text-white">
<!-- Ambient Background Light -->
<div class="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_-20%,_rgba(238,75,43,0.15),_transparent_60%)] z-0"></div>
<!-- Top App Bar -->
<header class="flex items-center px-4 py-3 justify-between z-20 bg-background-dark/80 backdrop-blur-md sticky top-0 border-b border-white/5">
<button class="text-white flex size-10 shrink-0 items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors active:scale-95">
<span class="material-symbols-outlined">arrow_back</span>
</button>
<div class="flex flex-col items-center flex-1 mx-4">
<h2 class="text-white text-[15px] font-bold leading-tight tracking-wide text-center truncate w-48">Avatar: The Way of Water</h2>
<p class="text-[#c99b92] text-xs font-medium mt-0.5">19:30 · Sala 4 IMAX</p>
</div>
<button class="text-white flex size-10 shrink-0 items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors active:scale-95">
<span class="material-symbols-outlined text-[20px]">calendar_month</span>
</button>
</header>
<!-- Main Content Area -->
<main class="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar relative w-full pb-40 z-10">
<!-- Screen Visual -->
<div class="w-full flex flex-col items-center pt-8 pb-12 perspective-[500px] relative">
<!-- Glow under screen -->
<div class="absolute top-8 w-3/4 h-20 bg-primary/20 blur-[60px] rounded-full"></div>
<!-- Curved Screen SVG -->
<svg class="w-[90%] z-10 drop-shadow-[0_4px_16px_rgba(238,75,43,0.2)]" height="48" preserveaspectratio="none" viewbox="0 0 320 48" width="100%">
<path d="M10,48 Q160,0 310,48" fill="none" stroke="url(#screenGradient)" stroke-linecap="round" stroke-width="4"></path>
<defs>
<lineargradient id="screenGradient" x1="0%" x2="100%" y1="0%" y2="0%">
<stop offset="0%" style="stop-color:rgba(255,255,255,0.1);stop-opacity:1"></stop>
<stop offset="50%" style="stop-color:rgba(238,75,43,0.9);stop-opacity:1"></stop>
<stop offset="100%" style="stop-color:rgba(255,255,255,0.1);stop-opacity:1"></stop>
</lineargradient>
</defs>
</svg>
<div class="mt-4 flex flex-col items-center gap-1 opacity-60">
<span class="text-xs font-bold tracking-[0.25em] text-white uppercase">Pantalla</span>
<span class="material-symbols-outlined text-sm animate-pulse">keyboard_arrow_down</span>
</div>
</div>
<!-- Seat Map Container -->
<div class="px-4 w-full overflow-x-auto no-scrollbar">
<!-- Seat Grid -->
<div class="min-w-[320px] max-w-sm mx-auto grid gap-y-3">
<!-- Row A -->
<div class="flex items-center justify-between gap-2">
<span class="text-white/20 text-[10px] font-bold w-4 text-center">A</span>
<div class="flex-1 grid grid-cols-8 gap-2 justify-items-center">
<div class="seat bg-white/5 border border-white/10 flex items-center justify-center cursor-not-allowed opacity-40"><span class="material-symbols-outlined text-[14px] text-white/50">close</span></div>
<div class="seat bg-white/5 border border-white/10 flex items-center justify-center cursor-not-allowed opacity-40"><span class="material-symbols-outlined text-[14px] text-white/50">close</span></div>
<div class="seat bg-white/5 border border-white/20 hover:border-primary/60 hover:shadow-[0_0_10px_rgba(238,75,43,0.2)] cursor-pointer"></div>
<div class="seat bg-white/5 border border-white/20 hover:border-primary/60 hover:shadow-[0_0_10px_rgba(238,75,43,0.2)] cursor-pointer"></div>
<div class="seat bg-white/5 border border-white/20 hover:border-primary/60 hover:shadow-[0_0_10px_rgba(238,75,43,0.2)] cursor-pointer"></div>
<div class="seat seat-selected cursor-pointer"></div>
<div class="seat seat-selected cursor-pointer"></div>
<div class="seat bg-white/5 border border-white/20 hover:border-primary/60 hover:shadow-[0_0_10px_rgba(238,75,43,0.2)] cursor-pointer"></div>
</div>
<span class="text-white/20 text-[10px] font-bold w-4 text-center">A</span>
</div>
<!-- Row B -->
<div class="flex items-center justify-between gap-2">
<span class="text-white/20 text-[10px] font-bold w-4 text-center">B</span>
<div class="flex-1 grid grid-cols-8 gap-2 justify-items-center">
<div class="seat bg-white/5 border border-white/20 hover:border-primary/60 hover:shadow-[0_0_10px_rgba(238,75,43,0.2)] cursor-pointer"></div>
<div class="seat bg-white/5 border border-white/20 hover:border-primary/60 hover:shadow-[0_0_10px_rgba(238,75,43,0.2)] cursor-pointer"></div>
<div class="seat bg-white/5 border border-white/20 hover:border-primary/60 hover:shadow-[0_0_10px_rgba(238,75,43,0.2)] cursor-pointer"></div>
<div class="seat bg-white/5 border border-white/20 hover:border-primary/60 hover:shadow-[0_0_10px_rgba(238,75,43,0.2)] cursor-pointer"></div>
<div class="seat bg-white/5 border border-white/10 flex items-center justify-center cursor-not-allowed opacity-40"><span class="material-symbols-outlined text-[14px] text-white/50">close</span></div>
<div class="seat bg-white/5 border border-white/10 flex items-center justify-center cursor-not-allowed opacity-40"><span class="material-symbols-outlined text-[14px] text-white/50">close</span></div>
<div class="seat bg-white/5 border border-white/20 hover:border-primary/60 hover:shadow-[0_0_10px_rgba(238,75,43,0.2)] cursor-pointer"></div>
<div class="seat bg-white/5 border border-white/20 hover:border-primary/60 hover:shadow-[0_0_10px_rgba(238,75,43,0.2)] cursor-pointer"></div>
</div>
<span class="text-white/20 text-[10px] font-bold w-4 text-center">B</span>
</div>
<!-- Row C -->
<div class="flex items-center justify-between gap-2">
<span class="text-white/20 text-[10px] font-bold w-4 text-center">C</span>
<div class="flex-1 grid grid-cols-8 gap-2 justify-items-center">
<div class="seat bg-white/5 border border-white/20 hover:border-primary/60 hover:shadow-[0_0_10px_rgba(238,75,43,0.2)] cursor-pointer"></div>
<div class="seat bg-white/5 border border-white/20 hover:border-primary/60 hover:shadow-[0_0_10px_rgba(238,75,43,0.2)] cursor-pointer"></div>
<div class="seat bg-white/5 border border-white/20 hover:border-primary/60 hover:shadow-[0_0_10px_rgba(238,75,43,0.2)] cursor-pointer"></div>
<div class="seat bg-white/5 border border-white/20 hover:border-primary/60 hover:shadow-[0_0_10px_rgba(238,75,43,0.2)] cursor-pointer"></div>
<div class="seat bg-white/5 border border-white/20 hover:border-primary/60 hover:shadow-[0_0_10px_rgba(238,75,43,0.2)] cursor-pointer"></div>
<div class="seat bg-white/5 border border-white/20 hover:border-primary/60 hover:shadow-[0_0_10px_rgba(238,75,43,0.2)] cursor-pointer"></div>
<div class="seat bg-white/5 border border-white/20 hover:border-primary/60 hover:shadow-[0_0_10px_rgba(238,75,43,0.2)] cursor-pointer"></div>
<div class="seat bg-white/5 border border-white/20 hover:border-primary/60 hover:shadow-[0_0_10px_rgba(238,75,43,0.2)] cursor-pointer"></div>
</div>
<span class="text-white/20 text-[10px] font-bold w-4 text-center">C</span>
</div>
<!-- Row D -->
<div class="flex items-center justify-between gap-2">
<span class="text-white/20 text-[10px] font-bold w-4 text-center">D</span>
<div class="flex-1 grid grid-cols-8 gap-2 justify-items-center">
<div class="seat bg-white/5 border border-white/20 hover:border-primary/60 hover:shadow-[0_0_10px_rgba(238,75,43,0.2)] cursor-pointer"></div>
<div class="seat bg-white/5 border border-white/20 hover:border-primary/60 hover:shadow-[0_0_10px_rgba(238,75,43,0.2)] cursor-pointer"></div>
<div class="seat bg-white/5 border border-white/20 hover:border-primary/60 hover:shadow-[0_0_10px_rgba(238,75,43,0.2)] cursor-pointer"></div>
<div class="seat bg-white/5 border border-white/20 hover:border-primary/60 hover:shadow-[0_0_10px_rgba(238,75,43,0.2)] cursor-pointer"></div>
<div class="seat bg-white/5 border border-white/20 hover:border-primary/60 hover:shadow-[0_0_10px_rgba(238,75,43,0.2)] cursor-pointer"></div>
<div class="seat bg-white/5 border border-white/20 hover:border-primary/60 hover:shadow-[0_0_10px_rgba(238,75,43,0.2)] cursor-pointer"></div>
<div class="seat bg-white/5 border border-white/20 hover:border-primary/60 hover:shadow-[0_0_10px_rgba(238,75,43,0.2)] cursor-pointer"></div>
<div class="seat bg-white/5 border border-white/20 hover:border-primary/60 hover:shadow-[0_0_10px_rgba(238,75,43,0.2)] cursor-pointer"></div>
</div>
<span class="text-white/20 text-[10px] font-bold w-4 text-center">D</span>
</div>
<!-- Row E - Couple/Premium -->
<div class="flex items-center justify-between gap-2 mt-4">
<span class="text-white/20 text-[10px] font-bold w-4 text-center">E</span>
<div class="flex-1 grid grid-cols-8 gap-2 justify-items-center">
<div class="seat bg-white/5 border border-white/20 hover:border-primary/60 hover:shadow-[0_0_10px_rgba(238,75,43,0.2)] cursor-pointer"></div>
<div class="seat bg-white/5 border border-white/20 hover:border-primary/60 hover:shadow-[0_0_10px_rgba(238,75,43,0.2)] cursor-pointer"></div>
<!-- Aisle Space -->
<div class="w-2 h-2"></div>
<div class="seat bg-white/5 border border-white/20 hover:border-primary/60 hover:shadow-[0_0_10px_rgba(238,75,43,0.2)] cursor-pointer"></div>
<div class="seat bg-white/5 border border-white/20 hover:border-primary/60 hover:shadow-[0_0_10px_rgba(238,75,43,0.2)] cursor-pointer"></div>
<!-- Aisle Space -->
<div class="w-2 h-2"></div>
<div class="seat bg-white/5 border border-white/20 hover:border-primary/60 hover:shadow-[0_0_10px_rgba(238,75,43,0.2)] cursor-pointer"></div>
<div class="seat bg-white/5 border border-white/20 hover:border-primary/60 hover:shadow-[0_0_10px_rgba(238,75,43,0.2)] cursor-pointer"></div>
</div>
<span class="text-white/20 text-[10px] font-bold w-4 text-center">E</span>
</div>
</div>
</div>
<!-- Legend -->
<div class="flex justify-center gap-4 mt-8 mb-4 px-4 flex-wrap">
<div class="flex items-center gap-2">
<div class="w-4 h-4 rounded border border-white/20 bg-white/5"></div>
<span class="text-white/60 text-xs font-medium">Disponible</span>
</div>
<div class="flex items-center gap-2">
<div class="w-4 h-4 rounded bg-white/5 flex items-center justify-center">
<span class="material-symbols-outlined text-[10px] text-white/30">close</span>
</div>
<span class="text-white/60 text-xs font-medium">Ocupado</span>
</div>
<div class="flex items-center gap-2">
<div class="w-4 h-4 rounded bg-primary shadow-[0_0_8px_rgba(238,75,43,0.6)]"></div>
<span class="text-white text-xs font-bold">Tu Selección</span>
</div>
</div>
</main>
<!-- Bottom Action Sheet -->
<footer class="fixed bottom-0 left-0 w-full z-30">
<div class="glass-panel w-full rounded-t-[2rem] p-5 pb-8 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
<!-- Drag Handle -->
<div class="w-full flex justify-center mb-4">
<div class="w-12 h-1 rounded-full bg-white/20"></div>
</div>
<div class="flex flex-col gap-4">
<!-- Info Row -->
<div class="flex items-end justify-between">
<div>
<p class="text-[#c99b92] text-xs uppercase font-bold tracking-wider mb-1">Total a pagar</p>
<div class="flex items-baseline gap-1">
<span class="text-2xl font-bold text-white">$12.000</span>
<span class="text-sm font-medium text-white/50">CLP</span>
</div>
</div>
<div class="flex flex-col items-end gap-1">
<div class="flex -space-x-2">
<div class="size-6 rounded-full bg-primary border border-background-dark flex items-center justify-center text-[10px] font-bold">A6</div>
<div class="size-6 rounded-full bg-primary border border-background-dark flex items-center justify-center text-[10px] font-bold">A7</div>
</div>
<p class="text-xs text-white/70">2 entradas seleccionadas</p>
</div>
</div>
<!-- CTA Button -->
<button class="relative w-full h-14 overflow-hidden rounded-2xl bg-primary text-white font-bold text-base shadow-[0_8px_20px_rgba(238,75,43,0.4)] transition-transform active:scale-[0.98] group">
<div class="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:animate-shimmer"></div>
<span class="relative flex items-center justify-center gap-2">
                        Confirmar Asientos
                        <span class="material-symbols-outlined text-xl">check_circle</span>
</span>
</button>
</div>
</div>
</footer>
</body></html>

-----



snacks



<!DOCTYPE html>

<html class="dark" lang="es"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Menú de Snacks y Bebidas</title>
<link href="https://fonts.googleapis.com" rel="preconnect"/>
<link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect"/>
<link href="https://fonts.googleapis.com/css2?family=Spline+Sans:wght@300;400;500;600;700&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    colors: {
                        "primary": "#ee4b2b",
                        "background-light": "#f8f6f6",
                        "background-dark": "#221310",
                    },
                    fontFamily: {
                        "display": ["Spline Sans", "sans-serif"]
                    },
                    borderRadius: {"DEFAULT": "0.5rem", "lg": "1rem", "xl": "1.5rem", "full": "9999px"},
                },
            },
        }
    </script>
<style>
        /* Hide scrollbar for Chrome, Safari and Opera */
        .no-scrollbar::-webkit-scrollbar {
            display: none;
        }
        /* Hide scrollbar for IE, Edge and Firefox */
        .no-scrollbar {
            -ms-overflow-style: none;  /* IE and Edge */
            scrollbar-width: none;  /* Firefox */
        }
        
        .glass-panel {
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border: 1px solid rgba(255, 255, 255, 0.08);
            box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
        }

        .glass-panel-active {
            background: #ee4b2b;
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            box-shadow: 0 4px 30px rgba(238, 75, 43, 0.3);
        }
    </style>
<style>
    body {
      min-height: max(884px, 100dvh);
    }
  </style>
  </head>
<body class="bg-background-light dark:bg-background-dark font-display antialiased selection:bg-primary selection:text-white">
<!-- Main Container with subtle gradient background for glass effect -->
<div class="relative min-h-screen w-full flex flex-col overflow-x-hidden bg-[#221310]">
<!-- Ambient Background Gradients -->
<div class="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
<div class="absolute top-[-10%] right-[-20%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px]"></div>
<div class="absolute bottom-[-10%] left-[-20%] w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px]"></div>
</div>
<!-- Sticky Header -->
<div class="sticky top-0 z-40 w-full glass-panel border-b-0 rounded-b-xl border-white/5">
<div class="flex items-center justify-between p-4 pb-2 pt-12 md:pt-4">
<button class="text-white flex size-10 items-center justify-center rounded-full hover:bg-white/10 transition-colors">
<span class="material-symbols-outlined text-2xl">arrow_back</span>
</button>
<h2 class="text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">Snacks y Bebidas</h2>
<div class="flex size-10 items-center justify-center">
<button class="flex items-center justify-center rounded-full size-10 hover:bg-white/10 transition-colors text-white">
<span class="material-symbols-outlined text-2xl">search</span>
</button>
</div>
</div>
<!-- Categories -->
<div class="flex gap-3 px-4 pb-4 overflow-x-auto no-scrollbar w-full mt-2">
<button class="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-xl glass-panel-active px-5 transition-transform active:scale-95">
<p class="text-white text-sm font-medium leading-normal">Todo</p>
</button>
<button class="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-xl glass-panel px-5 hover:bg-white/10 transition-transform active:scale-95">
<p class="text-white/90 text-sm font-medium leading-normal">Combos</p>
</button>
<button class="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-xl glass-panel px-5 hover:bg-white/10 transition-transform active:scale-95">
<p class="text-white/90 text-sm font-medium leading-normal">Palomitas</p>
</button>
<button class="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-xl glass-panel px-5 hover:bg-white/10 transition-transform active:scale-95">
<p class="text-white/90 text-sm font-medium leading-normal">Bebidas</p>
</button>
<button class="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-xl glass-panel px-5 hover:bg-white/10 transition-transform active:scale-95">
<p class="text-white/90 text-sm font-medium leading-normal">Dulces</p>
</button>
</div>
</div>
<!-- Scrollable Content -->
<div class="flex-1 flex flex-col z-10 pb-32">
<!-- Hero / Featured Card -->
<div class="p-4 w-full">
<div class="relative w-full rounded-2xl overflow-hidden shadow-2xl group">
<div class="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10"></div>
<!-- Image -->
<div class="w-full aspect-[16/9] bg-cover bg-center transition-transform duration-700 group-hover:scale-105" data-alt="Popcorn buckets and soda cups arranged nicely for a movie combo" style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuBRn8ct4Lg2jXdyf0Wue45UbRGAdURfzIWtxnTIdt1vGVQvySpjBsFRQHFg-rOK8dYx9rWeCKNIb4HJ8iPiDNcVEv_DGf4QpGwOpd2214y6i2arqjGjwTNQPsbPB1-ahobqoGfsID5sm5pdG8LEQVKh2YNeBMjUpavd3qiBVrzjCyivzPoP_I9NKrzyklxswLzJXP1QrwhfDcvc-aaEMaNzjmyxaK0-KAJRUyeuxXzTKavnNghRKLjWNt5qvLeLBPa-th3FoalK9Y8");'>
</div>
<div class="absolute bottom-0 left-0 w-full z-20 p-4">
<div class="glass-panel p-4 rounded-xl flex flex-col gap-2">
<div class="flex justify-between items-start">
<div>
<span class="inline-block px-2 py-0.5 rounded-md bg-primary/20 text-primary text-xs font-bold mb-1 border border-primary/20">OFERTA ESPECIAL</span>
<h3 class="text-white text-xl font-bold leading-tight">Combo Pareja</h3>
<p class="text-gray-300 text-sm mt-1">Palomitas grandes + 2 Refrescos</p>
</div>
<div class="text-right">
<span class="text-2xl font-bold text-white block">$250</span>
<span class="text-xs text-gray-400 line-through">$300</span>
</div>
</div>
<button class="mt-2 w-full h-10 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg text-sm transition-colors flex items-center justify-center gap-2">
<span class="material-symbols-outlined text-[18px]">add_shopping_cart</span>
                                Agregar
                            </button>
</div>
</div>
</div>
</div>
<!-- Section Title -->
<h3 class="text-white text-lg font-bold px-4 py-2 flex items-center gap-2">
<span class="material-symbols-outlined text-primary">local_fire_department</span>
                Populares ahora
            </h3>
<!-- Product Grid -->
<div class="grid grid-cols-2 gap-4 p-4">
<!-- Card 1: Popcorn (With Stepper Control) -->
<div class="glass-panel rounded-2xl p-3 flex flex-col gap-3 relative group">
<div class="aspect-square rounded-xl overflow-hidden bg-black/20 relative">
<img alt="Caramel Popcorn" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" data-alt="Golden caramel popcorn in a striped container" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCuSetJpYt8z4bDjswtnIBP0c73W7s2xT5QF1XuWZ8TyssHv8SljpFCMJN5ymHjyW3oMI6JiktG_OVfQhOOVGcJjFJQZ1uqR1B7tUfF-Yv3E6TDFDQL8X_mkiB6A7uj5Sb7BYnn69zL8KJqSP69kRL-FcvUoYwOcbnc_A896t9OF1_cq6K_8cWZeUmLJtPrrYBHZiZC5VZAua-HOWvwXi-MVYEeQoaMaYiPyEzpDUjRoMydqQ2ej-zRb7JcyFjYhuCy__N7pDojihU"/>
<div class="absolute top-2 right-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-lg">
<span class="text-white text-xs font-bold">$85</span>
</div>
</div>
<div>
<h4 class="text-white font-semibold text-base leading-tight truncate">Palomitas Caramelo</h4>
<p class="text-gray-400 text-xs mt-1">Grande</p>
</div>
<!-- Stepper Control Example -->
<div class="mt-auto bg-black/30 rounded-lg p-1 flex items-center justify-between border border-white/5">
<button class="size-7 rounded-md bg-white/5 hover:bg-white/10 text-white flex items-center justify-center transition-colors">
<span class="material-symbols-outlined text-sm">remove</span>
</button>
<span class="text-white font-medium text-sm">1</span>
<button class="size-7 rounded-md bg-primary hover:bg-primary/90 text-white flex items-center justify-center transition-colors shadow-lg shadow-primary/20">
<span class="material-symbols-outlined text-sm">add</span>
</button>
</div>
</div>
<!-- Card 2: Drink -->
<div class="glass-panel rounded-2xl p-3 flex flex-col gap-3 relative group">
<div class="aspect-square rounded-xl overflow-hidden bg-black/20 relative">
<img alt="Cola Drink" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" data-alt="Refreshing cola drink with ice and condensation" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC_ceaU_scE4ZrQc_vAWf8Cqz9hchkSI_5IxuOJl_dfpj3wEYK6EvnzADnGH8J2v1him8Vw-kXAkkF5yfOznI9V0csFLNYwP-zAqBoaZavTOcd4KCPnjP5A0vikttKddkhudiRoLsSDTybd-L9VASJb1HxEGBQfLL2uLf9f5DOeXP2hJkMEELLpwGPfGC91gyco2Ry1xssFOffgx_gt7cIMnfu69nMOSx-B4Ggwxe3gHwZYeNmjevW-P2Lz1uv12Z1lptwjfb1dz9w"/>
<div class="absolute top-2 right-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-lg">
<span class="text-white text-xs font-bold">$45</span>
</div>
</div>
<div>
<h4 class="text-white font-semibold text-base leading-tight truncate">Refresco Cola</h4>
<p class="text-gray-400 text-xs mt-1">Mediano</p>
</div>
<div class="mt-auto">
<button class="w-full h-9 bg-white/10 hover:bg-white/20 border border-white/10 text-white font-medium rounded-lg text-sm transition-colors flex items-center justify-center gap-1 group-active:scale-95">
                            Agregar
                        </button>
</div>
</div>
<!-- Card 3: Nachos -->
<div class="glass-panel rounded-2xl p-3 flex flex-col gap-3 relative group">
<div class="aspect-square rounded-xl overflow-hidden bg-black/20 relative">
<img alt="Nachos" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" data-alt="Crispy nachos covered with melted yellow cheese and jalapenos" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD9_XTU8-rHSQR4w7e_wZNg8-YbfMipjBz9hFEsp8QG4FDYs8K08A-4WgyP-bqJT-5r7uq7nsp0-JmAM9Tg9ne-6we4Gpd8RP_BnevSohmVf-o9xBgxNPaOKZrk60ebeoKEYcAg5kD4c2ocNpgvw980hhCy8H83YI2M4-7HVLH_rs9ij_6azyXXqoJLWhLebBToMGxKD-pBvo_jLXy3K1A4XB5L9mApCkUELuZqXzUIjO_66MOL4BSwOZrNFmUP3BDGO4knUXG_gQc"/>
<div class="absolute top-2 right-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-lg">
<span class="text-white text-xs font-bold">$60</span>
</div>
</div>
<div>
<h4 class="text-white font-semibold text-base leading-tight truncate">Nachos con Queso</h4>
<p class="text-gray-400 text-xs mt-1">Con jalapeños</p>
</div>
<div class="mt-auto">
<button class="w-full h-9 bg-white/10 hover:bg-white/20 border border-white/10 text-white font-medium rounded-lg text-sm transition-colors flex items-center justify-center gap-1 group-active:scale-95">
                            Agregar
                        </button>
</div>
</div>
<!-- Card 4: Candy -->
<div class="glass-panel rounded-2xl p-3 flex flex-col gap-3 relative group">
<div class="aspect-square rounded-xl overflow-hidden bg-black/20 relative">
<img alt="Chocolate Candy" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" data-alt="Colorful chocolate candies piled up" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCD2q3PSkF9w56FqLz76MfyWnN3EKmUKP-3m5uaEqb80wj4FmHs0FFHeZd69vdVgZTT7ZV6gqkEulI-476evHnKUuETuzcdpMAq-u5eJsu_hQI3QohTB87IzNuhV8HW1oAB7vvpBp2lmFtiixYFKhkbj024o7aO1EuaPXO_yFhPbYXspaqAJZlJ2CY0tPIJNJNqLwGl7pG3ff5jEQOuRIgFLc024U1MprYMUZJg48JkWptP-I8sCmaCa6B8Q3xpXmBfipK1gamX1MM"/>
<div class="absolute top-2 right-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-lg">
<span class="text-white text-xs font-bold">$35</span>
</div>
</div>
<div>
<h4 class="text-white font-semibold text-base leading-tight truncate">M&amp;Ms Chocolate</h4>
<p class="text-gray-400 text-xs mt-1">Bolsa 100g</p>
</div>
<div class="mt-auto">
<button class="w-full h-9 bg-white/10 hover:bg-white/20 border border-white/10 text-white font-medium rounded-lg text-sm transition-colors flex items-center justify-center gap-1 group-active:scale-95">
                            Agregar
                        </button>
</div>
</div>
<!-- Card 5: Hot Dog -->
<div class="glass-panel rounded-2xl p-3 flex flex-col gap-3 relative group">
<div class="aspect-square rounded-xl overflow-hidden bg-black/20 relative">
<img alt="Hot Dog" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" data-alt="Classic hot dog with mustard and ketchup" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBL_qxJaw-LeWumvAjxtpezRqj_Ql0-00AblxAFJs542VbilKm0SRmuOPFPsPTRVQRWSHRa5k8s9K2UHL0g6tK7dILyzuauJmlhvxQ9L2QTMUR8i2OSjH4Tp-ITqvtF28Pj7mFJIeSf0odpBiY8wNiQSu6kNVbLwMQrHDpuoszj8Dbnqw9vznZIwy2Cv3WauJAfXJLbLdWs3eXxpaxNX8ymr3RgEg_2cLYzjO3mxTnSM6mgO3Fru2jrIndWtm8KTdw3l32bN99Etq0"/>
<div class="absolute top-2 right-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-lg">
<span class="text-white text-xs font-bold">$55</span>
</div>
</div>
<div>
<h4 class="text-white font-semibold text-base leading-tight truncate">Hot Dog Clásico</h4>
<p class="text-gray-400 text-xs mt-1">Jumbo</p>
</div>
<div class="mt-auto">
<button class="w-full h-9 bg-white/10 hover:bg-white/20 border border-white/10 text-white font-medium rounded-lg text-sm transition-colors flex items-center justify-center gap-1 group-active:scale-95">
                            Agregar
                        </button>
</div>
</div>
<!-- Card 6: Slushie -->
<div class="glass-panel rounded-2xl p-3 flex flex-col gap-3 relative group">
<div class="aspect-square rounded-xl overflow-hidden bg-black/20 relative">
<img alt="Slushie" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" data-alt="Red strawberry ice slushie in a plastic cup" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBM6TxOex6Cgi7IMpdrFMBVtdtbmo3CmaNKMs8IVUoLCajB5evKCtgGV37BJrvRpwTWAVlVO6AQ3xpvMYnpEA6OL6meaQnyUW9iR7fSZ2-7Kbrh_CNYmUlrazcALWv6rC769kJ9IYUWYncRY-QUJRrKOCASl3KUtpUBGR6TqV2ty6UaVY3TZ76vk_h9wFcm8_DhwuG-sY3j7SlkP4u0-buSuWgMV-6vexBcyQjYTVSd6BxLJ5W9HobrTny8mCLS-PzrPT2vXniuhik"/>
<div class="absolute top-2 right-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-lg">
<span class="text-white text-xs font-bold">$50</span>
</div>
</div>
<div>
<h4 class="text-white font-semibold text-base leading-tight truncate">Icee Cereza</h4>
<p class="text-gray-400 text-xs mt-1">Grande</p>
</div>
<div class="mt-auto">
<button class="w-full h-9 bg-white/10 hover:bg-white/20 border border-white/10 text-white font-medium rounded-lg text-sm transition-colors flex items-center justify-center gap-1 group-active:scale-95">
                            Agregar
                        </button>
</div>
</div>
</div>
</div>
<!-- Floating Cart Bar -->
<div class="fixed bottom-0 left-0 w-full p-4 z-50">
<div class="glass-panel p-4 rounded-2xl flex items-center justify-between shadow-[0_8px_32px_rgba(0,0,0,0.5)] border-t border-white/10 relative overflow-hidden">
<!-- Inner glow effect for emphasis -->
<div class="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent pointer-events-none"></div>
<div class="flex items-center gap-3 relative z-10">
<div class="bg-primary/20 p-2 rounded-xl text-primary">
<span class="material-symbols-outlined">shopping_bag</span>
</div>
<div class="flex flex-col">
<span class="text-white font-bold text-sm">2 Items</span>
<span class="text-primary font-bold text-base">$130.00</span>
</div>
</div>
<button class="relative z-10 bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-primary/25 active:scale-95 transition-all flex items-center gap-2">
                    Ir a Pagar
                    <span class="material-symbols-outlined text-[18px]">arrow_forward</span>
</button>
</div>
</div>
</div>
</body></html>

----------



resumen de compras:-


<!DOCTYPE html>

<html class="dark" lang="es"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Resumen y Pago - Cinema App</title>
<!-- Fonts -->
<link href="https://fonts.googleapis.com" rel="preconnect"/>
<link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect"/>
<link href="https://fonts.googleapis.com/css2?family=Spline+Sans:wght@300;400;500;600;700&amp;display=swap" rel="stylesheet"/>
<!-- Material Symbols -->
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<!-- Tailwind CSS -->
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<!-- Tailwind Config -->
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    colors: {
                        "primary": "#ee4b2b",
                        "primary-light": "#ff7b5f",
                        "background-light": "#f8f6f6",
                        "background-dark": "#0a0a0a", // Deep charcoal/black per plan
                        "glass-border": "rgba(255, 255, 255, 0.1)",
                        "glass-surface": "rgba(255, 255, 255, 0.05)",
                    },
                    fontFamily: {
                        "display": ["Spline Sans", "sans-serif"]
                    },
                    borderRadius: {
                        "DEFAULT": "0.5rem",
                        "lg": "1rem",
                        "xl": "1.5rem",
                        "full": "9999px"
                    },
                    backgroundImage: {
                        'liquid-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.02))',
                        'primary-gradient': 'linear-gradient(90deg, #ee4b2b 0%, #ff6b4a 100%)',
                    }
                },
            },
        }
    </script>
<style>
        /* Custom scrollbar hiding for cleaner look */
        .no-scrollbar::-webkit-scrollbar {
            display: none;
        }
        .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
        
        /* Glassmorphism utilities */
        .glass {
            background: rgba(30, 30, 30, 0.4);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.08);
        }
        
        .glass-card {
            background: linear-gradient(145deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.03) 100%);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.08);
            box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);
        }

        .glass-input {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
        }

        /* Shimmer effect for the pay button */
        @keyframes shimmer {
            0% { background-position: -200% center; }
            100% { background-position: 200% center; }
        }
        
        .liquid-btn {
            background: linear-gradient(90deg, #ee4b2b 0%, #ff7b5f 50%, #ee4b2b 100%);
            background-size: 200% auto;
            animation: shimmer 3s infinite linear;
            box-shadow: 0 0 20px rgba(238, 75, 43, 0.4);
        }
    </style>
<style>
    body {
      min-height: max(884px, 100dvh);
    }
  </style>
  </head>
<body class="bg-background-light dark:bg-background-dark font-display text-slate-800 dark:text-white antialiased selection:bg-primary selection:text-white">
<div class="relative flex h-full min-h-screen w-full flex-col overflow-x-hidden pb-32">
<!-- Header -->
<header class="sticky top-0 z-50 flex items-center justify-between p-4 pb-2 glass border-b-0 border-white/5">
<button class="flex size-10 items-center justify-center rounded-full text-white hover:bg-white/10 transition-colors">
<span class="material-symbols-outlined text-2xl">arrow_back</span>
</button>
<h2 class="text-white text-lg font-bold leading-tight tracking-tight flex-1 text-center pr-10">Resumen de Compra</h2>
</header>
<!-- Main Content -->
<main class="flex flex-col gap-6 p-4">
<!-- Movie Card -->
<div class="glass-card rounded-xl p-4 flex gap-4 items-stretch group">
<div class="flex flex-col flex-1 gap-3 justify-between">
<div>
<h3 class="text-white text-lg font-bold leading-tight mb-1">Avatar: The Way of Water</h3>
<div class="flex items-center gap-1.5 text-gray-400 text-sm">
<span class="material-symbols-outlined text-[16px]">schedule</span>
<span>Hoy, 18:30</span>
<span class="mx-1">•</span>
<span>Sala 4 IMAX</span>
</div>
</div>
<button class="flex h-8 items-center justify-center gap-2 rounded-lg bg-white/10 px-4 text-xs font-medium text-white transition hover:bg-white/20 w-fit">
<span class="material-symbols-outlined text-[16px]">edit</span>
                        Editar
                    </button>
</div>
<div class="w-24 shrink-0 rounded-lg bg-cover bg-center shadow-lg aspect-[2/3]" data-alt="Avatar movie poster showing blue alien face close up" style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuAOFf_V2TzrEvuaTghUL1FEvorDrKXmKldbXupCs-Off3k-gfqUYwUf3Hyqo7f6y84RIO-GVmYej5E_I3NSbNqjgTujjR6dQNgZEENvPvVeMmi8AlcggHNA1OUVgF47ma8bwnazipIeQc81RNoKbGKxKKaU8YNjm4sCoYlQCmLMOMMAH14u2L0r6Uin7uf2WzU1EufIdh1gWHChRM3ah1bSgTTKnAaXnYrs3NuHc_-dS-ZyWMwPlo8L59DK4mGI-tFvQgV3B2p0BOo");'>
</div>
</div>
<!-- Order Breakdown: Tickets -->
<div class="flex flex-col gap-3">
<h3 class="text-white/80 text-sm font-semibold uppercase tracking-wider px-1">Tus Entradas</h3>
<div class="glass-card rounded-xl overflow-hidden flex flex-col divide-y divide-white/5">
<!-- Ticket Item 1 -->
<div class="flex items-center justify-between p-4">
<div class="flex items-center gap-4">
<div class="flex size-10 items-center justify-center rounded-lg bg-primary/20 text-primary shrink-0">
<span class="material-symbols-outlined">confirmation_number</span>
</div>
<div>
<p class="text-white text-base font-medium">2x Adulto</p>
<p class="text-gray-400 text-xs">Entrada General</p>
</div>
</div>
<p class="text-white font-semibold">$24.00</p>
</div>
<!-- Ticket Item 2 (Seats) -->
<div class="flex items-center justify-between p-4 bg-white/[0.02]">
<div class="flex items-center gap-4">
<div class="flex size-10 items-center justify-center rounded-lg bg-white/10 text-gray-300 shrink-0">
<span class="material-symbols-outlined">chair</span>
</div>
<div>
<p class="text-white text-base font-medium">Asientos: F12, F13</p>
<p class="text-gray-400 text-xs">Zona Premium</p>
</div>
</div>
<button class="size-8 flex items-center justify-center rounded-full hover:bg-white/10 text-gray-400 transition">
<span class="material-symbols-outlined text-[20px]">edit</span>
</button>
</div>
</div>
</div>
<!-- Order Breakdown: Snacks -->
<div class="flex flex-col gap-3">
<h3 class="text-white/80 text-sm font-semibold uppercase tracking-wider px-1">Snacks &amp; Bebidas</h3>
<div class="glass-card rounded-xl p-4 flex gap-4 items-center">
<div class="size-16 shrink-0 rounded-lg bg-cover bg-center bg-no-repeat bg-white/5" data-alt="Bucket of popcorn and soda cup" style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuC6mq2J8HF4nEhPwQiyRo_NTKJHsj3V_-TjQvzUqzmV0IXDHYFuwOIrwRFtK_LJVi5vIEdO6OAweFduqK_QhM0RkKHdBua7mlvQwzm_GH5W0CR-TuYEHTLtQEm5NVtZgUnSBDWbA3iTHmMgqePTkkLPcH9erzwEQnH390rd1617xZk5QbaPqPJxAKLofrSwKU1-qFg82K-IdIQu_s_Df4R02xEgHJ5AkyDnV6hjLalfzpodzI3OWVW18Cno9xjiIQnDLnw0VyhW-H0");'>
</div>
<div class="flex-1">
<p class="text-white text-base font-bold">Combo Palomitas G</p>
<p class="text-primary text-sm font-medium">$12.00</p>
</div>
<div class="flex items-center gap-3 bg-black/20 rounded-lg p-1 border border-white/5">
<button class="size-7 flex items-center justify-center rounded text-white hover:bg-white/10">
<span class="material-symbols-outlined text-[18px]">remove</span>
</button>
<span class="text-white font-medium text-sm">1</span>
<button class="size-7 flex items-center justify-center rounded text-white bg-white/10">
<span class="material-symbols-outlined text-[18px]">add</span>
</button>
</div>
</div>
<!-- Add more button -->
<button class="w-full py-3 rounded-xl border border-dashed border-white/20 text-gray-400 text-sm font-medium hover:bg-white/5 hover:text-white hover:border-white/40 transition flex items-center justify-center gap-2">
<span class="material-symbols-outlined text-[18px]">add_circle</span>
                    Agregar más snacks
                </button>
</div>
<!-- Payment Methods -->
<div class="flex flex-col gap-3">
<div class="flex justify-between items-center px-1">
<h3 class="text-white/80 text-sm font-semibold uppercase tracking-wider">Método de Pago</h3>
<button class="text-primary text-xs font-medium">Cambiar</button>
</div>
<div class="flex gap-3 overflow-x-auto no-scrollbar pb-2">
<!-- Selected Card -->
<div class="relative min-w-[280px] h-[160px] rounded-xl p-5 flex flex-col justify-between overflow-hidden shadow-lg border border-white/10 group">
<!-- Card background -->
<div class="absolute inset-0 bg-gradient-to-br from-slate-800 to-black z-0"></div>
<div class="absolute top-0 right-0 -mr-10 -mt-10 size-40 bg-primary/20 rounded-full blur-3xl"></div>
<div class="relative z-10 flex justify-between items-start">
<span class="material-symbols-outlined text-white text-3xl">contactless</span>
<div class="bg-white/10 p-1.5 rounded-full backdrop-blur-md">
<span class="material-symbols-outlined text-green-400 text-xl block">check</span>
</div>
</div>
<div class="relative z-10">
<p class="text-white/60 text-xs font-medium mb-1">Mastercard</p>
<div class="flex items-center justify-between">
<p class="text-white text-lg font-mono tracking-widest">•••• 8834</p>
<p class="text-white/80 text-xs">12/25</p>
</div>
</div>
</div>
<!-- Apple Pay Option -->
<div class="min-w-[100px] h-[160px] rounded-xl bg-white text-black p-4 flex flex-col items-center justify-center gap-2 opacity-60 hover:opacity-100 transition border border-transparent hover:border-primary">
<span class="material-symbols-outlined text-4xl">phone_iphone</span>
<span class="text-xs font-bold text-center">Apple Pay</span>
</div>
</div>
</div>
<!-- Discount Code -->
<div class="glass-card rounded-xl p-1.5 flex items-center gap-2 mt-2">
<div class="pl-3 text-gray-400">
<span class="material-symbols-outlined text-xl">sell</span>
</div>
<input class="bg-transparent border-none text-white placeholder-gray-500 focus:ring-0 w-full text-sm" placeholder="Código de descuento" type="text"/>
<button class="px-4 py-2 bg-white/10 text-white text-xs font-semibold rounded-lg hover:bg-white/20 transition">
                    Aplicar
                </button>
</div>
<!-- Spacer for fixed footer -->
<div class="h-8"></div>
</main>
<!-- Sticky Footer -->
<footer class="fixed bottom-0 left-0 w-full z-40">
<!-- Glass background blur for the footer area -->
<div class="absolute inset-0 bg-background-dark/80 backdrop-blur-xl border-t border-white/10"></div>
<div class="relative p-5 pb-8 flex flex-col gap-4">
<!-- Totals Row -->
<div class="flex flex-col gap-1">
<div class="flex justify-between text-sm text-gray-400">
<span>Subtotal</span>
<span>$36.00</span>
</div>
<div class="flex justify-between text-sm text-gray-400">
<span>Cargo por servicio</span>
<span>$2.00</span>
</div>
<div class="flex justify-between items-end mt-1">
<span class="text-white font-medium text-lg">Total</span>
<span class="text-primary font-bold text-2xl tracking-tight">$38.00</span>
</div>
</div>
<!-- Action Button -->
<button class="liquid-btn group relative w-full overflow-hidden rounded-xl p-4 transition-all hover:scale-[1.02] active:scale-[0.98]">
<div class="relative z-10 flex items-center justify-center gap-2">
<span class="text-white font-bold text-lg tracking-wide">Pagar Ahora</span>
<span class="material-symbols-outlined text-white group-hover:translate-x-1 transition-transform">arrow_forward</span>
</div>
<!-- Shine effect overlay -->
<div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
</button>
</div>
</footer>
</div>
</body></html>

----


-----


mis entradas


<!DOCTYPE html>

<html class="dark" lang="es"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Mis Entradas - Cinema App</title>
<!-- Google Fonts -->
<link href="https://fonts.googleapis.com" rel="preconnect"/>
<link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect"/>
<link href="https://fonts.googleapis.com/css2?family=Spline+Sans:wght@300;400;500;600;700&amp;display=swap" rel="stylesheet"/>
<!-- Material Symbols -->
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<!-- Tailwind CSS -->
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<!-- Theme Config -->
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    colors: {
                        "primary": "#ee4b2b",
                        "background-light": "#f8f6f6",
                        "background-dark": "#221310",
                    },
                    fontFamily: {
                        "display": ["Spline Sans", "sans-serif"]
                    },
                    borderRadius: {"DEFAULT": "0.5rem", "lg": "1rem", "xl": "1.5rem", "2xl": "2rem", "full": "9999px"},
                },
            },
        }
    </script>
<style>
        /* Hide scrollbar for Chrome, Safari and Opera */
        .no-scrollbar::-webkit-scrollbar {
            display: none;
        }
        /* Hide scrollbar for IE, Edge and Firefox */
        .no-scrollbar {
            -ms-overflow-style: none;  /* IE and Edge */
            scrollbar-width: none;  /* Firefox */
        }
        
        .glass-panel {
            background: rgba(255, 255, 255, 0.03);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
        }

        .glass-card-active {
            background: rgba(255, 255, 255, 0.08);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.15);
            box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
        }

        .liquid-blob {
            position: absolute;
            border-radius: 50%;
            filter: blur(80px);
            z-index: 0;
            animation: blob-bounce 10s infinite ease-in-out alternate;
        }

        @keyframes blob-bounce {
            0% { transform: translate(0, 0) scale(1); }
            100% { transform: translate(20px, -20px) scale(1.1); }
        }
    </style>
<style>
    body {
      min-height: max(884px, 100dvh);
    }
  </style>
  </head>
<body class="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white antialiased overflow-x-hidden selection:bg-primary selection:text-white">
<!-- Ambient Liquid Background Elements -->
<div class="fixed inset-0 overflow-hidden pointer-events-none z-0">
<div class="liquid-blob w-96 h-96 bg-primary/20 top-[-10%] right-[-20%]"></div>
<div class="liquid-blob w-80 h-80 bg-purple-500/10 top-[20%] left-[-20%] delay-1000"></div>
<div class="liquid-blob w-[500px] h-[500px] bg-blue-500/5 bottom-[-10%] right-[-10%] delay-2000"></div>
</div>
<!-- Main Content Container -->
<div class="relative z-10 flex flex-col min-h-screen pb-28">
<!-- Top Header Area -->
<header class="sticky top-0 z-30 px-6 pt-14 pb-4 flex justify-between items-center bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-white/5">
<div class="flex items-center gap-3">
<div class="relative">
<div class="w-10 h-10 rounded-full bg-cover bg-center border-2 border-white/20" data-alt="User profile avatar image" style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuBY16Z8-n0powbSsbiKV-Do6isAQ3BCWIoqKSmeiqxyclRDcI9F5WL4eBOCS-5M8jmqPgUIfqHrNUoDdO3nkohWrzRTtfbRl-VWTnR0fbOmgy1iIPOY3WJntSmQCCeuUnwzhMf6CI11yazyu65-7VlAZXz1rjvdPLN0TrrQTPSYV7rh7nnOkJr5_zXzYgT6RzUtXB5ZqqMfVdS9H7izq7F4krxgAKdnYTcE04_T3V93-da-0MkFu9QLJDOmknjjfjrzRNQvE2vjpgY');"></div>
<div class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border border-background-dark"></div>
</div>
<div>
<p class="text-xs text-white/60 font-medium">Bienvenido de nuevo</p>
<h1 class="text-lg font-bold leading-tight">Hola, Sofía 👋</h1>
</div>
</div>
<button class="relative w-10 h-10 flex items-center justify-center rounded-full glass-panel hover:bg-white/10 transition-colors">
<span class="material-symbols-outlined text-white" style="font-size: 24px;">notifications</span>
<span class="absolute top-2 right-2 w-2.5 h-2.5 bg-primary rounded-full border border-background-dark"></span>
</button>
</header>
<!-- Active Tickets Section -->
<section class="mt-6 flex flex-col gap-4">
<div class="px-6 flex justify-between items-end">
<h2 class="text-2xl font-bold text-white tracking-tight">Mis Entradas</h2>
<a class="text-primary text-sm font-semibold hover:text-primary/80" href="#">Ver todas</a>
</div>
<!-- Liquid Glass Carousel -->
<div class="w-full overflow-x-auto snap-x snap-mandatory flex gap-5 px-6 pb-8 pt-2 no-scrollbar">
<!-- Ticket 1: Active -->
<div class="snap-center shrink-0 w-[85vw] max-w-[340px] flex flex-col glass-card-active rounded-3xl overflow-hidden relative group">
<!-- Glow effect behind -->
<div class="absolute top-0 right-0 w-32 h-32 bg-primary/30 blur-[60px] rounded-full pointer-events-none"></div>
<!-- Poster Area -->
<div class="h-48 w-full bg-cover bg-center relative" data-alt="Movie poster for Avatar: The Way of Water showing blue alien characters" style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuA-Bfy3Ij3bqF4a07hVeSvhNXXmu0n5FqQdCkcXJoZ4u5EjFEQrDDx1n3Il1MduoUjt-YsljpvXMuMLSjqQqjItrexyw1xfRKTlg3sEn5ej3DJMJmqpJ1Ff3h5CMrnejA_8-2CyL6Va6w6chXu4eNGtp15-cSBY8gh1SqPOfNne2UPvnjr7f3A2ZVZvzvgT2eisKP4WJj0pi9pD6H7Id2c2SSFNaZlIiNX9VOHliGAnrpPYltBM-anrx8igOPjNOalxCkUsqnO0FcA');">
<div class="absolute inset-0 bg-gradient-to-t from-background-dark/90 via-transparent to-transparent"></div>
<div class="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-lg border border-white/10">
<span class="text-xs font-bold text-white uppercase tracking-wider">IMAX 3D</span>
</div>
</div>
<!-- Ticket Details -->
<div class="p-5 flex flex-col gap-4 -mt-12 relative z-10">
<div>
<h3 class="text-2xl font-bold text-white leading-tight mb-1">Avatar: El Camino del Agua</h3>
<p class="text-white/60 text-sm flex items-center gap-1">
<span class="material-symbols-outlined text-[16px]">location_on</span>
                                Cineplex Centro, Sala 4
                            </p>
</div>
<!-- Info Grid -->
<div class="grid grid-cols-3 gap-2 bg-white/5 rounded-2xl p-3 border border-white/5">
<div class="flex flex-col items-center justify-center border-r border-white/10">
<span class="text-[10px] uppercase text-white/40 font-bold">Fecha</span>
<span class="text-sm font-bold text-white">14 Oct</span>
</div>
<div class="flex flex-col items-center justify-center border-r border-white/10">
<span class="text-[10px] uppercase text-white/40 font-bold">Hora</span>
<span class="text-sm font-bold text-white">18:30</span>
</div>
<div class="flex flex-col items-center justify-center">
<span class="text-[10px] uppercase text-white/40 font-bold">Asientos</span>
<span class="text-sm font-bold text-white">H4, H5</span>
</div>
</div>
<!-- Barcode Area -->
<div class="bg-white rounded-xl p-3 flex items-center justify-between gap-3 shadow-lg">
<div class="h-10 flex-1 bg-[url('https://placeholder.pics/svg/200x50/000000/ffffff/Barcode')] bg-repeat-x bg-contain opacity-80" data-alt="Abstract barcode pattern representing a ticket code"></div>
<div class="h-10 w-10 bg-black rounded-lg flex items-center justify-center shrink-0">
<span class="material-symbols-outlined text-white" style="font-size: 20px;">qr_code_2</span>
</div>
</div>
</div>
</div>
<!-- Ticket 2: Secondary -->
<div class="snap-center shrink-0 w-[85vw] max-w-[340px] flex flex-col glass-panel rounded-3xl overflow-hidden relative opacity-90 scale-95 origin-left">
<div class="h-48 w-full bg-cover bg-center relative grayscale-[50%]" data-alt="Movie poster for Super Mario Bros Movie" style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuDGn34OTEL0LGupZljooSoIz2PteuEijKScd-9lnc4uBpDRaKhmTkOni3aDWLkOGAtVRHmBopwQ_xEd-_dLwyYEEHS1qnNzLVs5tCOMoSWJawrAf3weEKwA_0JmVPd_rnarrx0Z5lOew1IwcCPAWhQU8zMefPOZJQOXweMsTBaLwcWK2LWvlU5PmLNQg68c5qJFU38EnZ7VTBPj2kWw-4TmFeSLMqP36kAJdrk7u1Y-BSYePdxoiGVRtoBsbgFvgbU9KwtVJRad3oc');">
<div class="absolute inset-0 bg-gradient-to-t from-background-dark/90 via-transparent to-transparent"></div>
</div>
<div class="p-5 flex flex-col gap-4 -mt-12 relative z-10">
<div>
<h3 class="text-xl font-bold text-white leading-tight mb-1">Super Mario Bros</h3>
<p class="text-white/60 text-sm flex items-center gap-1">
<span class="material-symbols-outlined text-[16px]">location_on</span>
                                Cineplex Norte, Sala 2
                            </p>
</div>
<div class="grid grid-cols-3 gap-2 bg-white/5 rounded-2xl p-3 border border-white/5">
<div class="flex flex-col items-center justify-center border-r border-white/10">
<span class="text-[10px] uppercase text-white/40 font-bold">Fecha</span>
<span class="text-sm font-bold text-white">15 Oct</span>
</div>
<div class="flex flex-col items-center justify-center border-r border-white/10">
<span class="text-[10px] uppercase text-white/40 font-bold">Hora</span>
<span class="text-sm font-bold text-white">20:00</span>
</div>
<div class="flex flex-col items-center justify-center">
<span class="text-[10px] uppercase text-white/40 font-bold">Asientos</span>
<span class="text-sm font-bold text-white">J12</span>
</div>
</div>
</div>
</div>
</div>
</section>
<!-- Quick Actions Row -->
<section class="px-6 mb-8">
<h3 class="text-sm font-bold text-white/50 uppercase tracking-widest mb-4 ml-1">Acciones Rápidas</h3>
<div class="flex justify-between items-start">
<button class="flex flex-col items-center gap-2 group">
<div class="w-16 h-16 rounded-full glass-panel flex items-center justify-center group-hover:bg-primary/20 transition-all border border-white/10 group-active:scale-95">
<span class="material-symbols-outlined text-white group-hover:text-primary transition-colors text-2xl">history</span>
</div>
<span class="text-xs font-medium text-white/80">Historial</span>
</button>
<button class="flex flex-col items-center gap-2 group">
<div class="w-16 h-16 rounded-full glass-panel flex items-center justify-center group-hover:bg-primary/20 transition-all border border-white/10 group-active:scale-95">
<span class="material-symbols-outlined text-white group-hover:text-primary transition-colors text-2xl">credit_card</span>
</div>
<span class="text-xs font-medium text-white/80">Pagos</span>
</button>
<button class="flex flex-col items-center gap-2 group">
<div class="w-16 h-16 rounded-full glass-panel flex items-center justify-center group-hover:bg-primary/20 transition-all border border-white/10 group-active:scale-95">
<span class="material-symbols-outlined text-white group-hover:text-primary transition-colors text-2xl">confirmation_number</span>
</div>
<span class="text-xs font-medium text-white/80">Cupones</span>
</button>
<button class="flex flex-col items-center gap-2 group">
<div class="w-16 h-16 rounded-full glass-panel flex items-center justify-center group-hover:bg-primary/20 transition-all border border-white/10 group-active:scale-95">
<span class="material-symbols-outlined text-white group-hover:text-primary transition-colors text-2xl">support_agent</span>
</div>
<span class="text-xs font-medium text-white/80">Soporte</span>
</button>
</div>
</section>
<!-- Profile Settings List -->
<section class="px-6 flex flex-col gap-3">
<h3 class="text-sm font-bold text-white/50 uppercase tracking-widest mb-1 ml-1">Configuración</h3>
<!-- Item 1 -->
<button class="w-full text-left p-4 rounded-2xl glass-panel flex items-center gap-4 hover:bg-white/5 transition-colors group active:scale-[0.99]">
<div class="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors">
<span class="material-symbols-outlined text-xl">person</span>
</div>
<div class="flex-1">
<p class="text-base font-semibold text-white">Editar Perfil</p>
<p class="text-xs text-white/40">Cambiar nombre, email, teléfono</p>
</div>
<span class="material-symbols-outlined text-white/30">chevron_right</span>
</button>
<!-- Item 2 -->
<button class="w-full text-left p-4 rounded-2xl glass-panel flex items-center gap-4 hover:bg-white/5 transition-colors group active:scale-[0.99]">
<div class="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-colors">
<span class="material-symbols-outlined text-xl">notifications</span>
</div>
<div class="flex-1">
<p class="text-base font-semibold text-white">Notificaciones</p>
<p class="text-xs text-white/40">Gestionar alertas y promociones</p>
</div>
<span class="material-symbols-outlined text-white/30">chevron_right</span>
</button>
<!-- Item 3 -->
<button class="w-full text-left p-4 rounded-2xl glass-panel flex items-center gap-4 hover:bg-white/5 transition-colors group active:scale-[0.99]">
<div class="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-400 group-hover:bg-orange-500 group-hover:text-white transition-colors">
<span class="material-symbols-outlined text-xl">movie</span>
</div>
<div class="flex-1">
<p class="text-base font-semibold text-white">Preferencias de Cine</p>
<p class="text-xs text-white/40">Géneros favoritos, cines cercanos</p>
</div>
<span class="material-symbols-outlined text-white/30">chevron_right</span>
</button>
<!-- Item 4 (Logout) -->
<button class="w-full text-left p-4 rounded-2xl border border-red-500/20 bg-red-500/5 flex items-center gap-4 hover:bg-red-500/10 transition-colors group mt-2 active:scale-[0.99]">
<div class="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 group-hover:text-red-400 transition-colors">
<span class="material-symbols-outlined text-xl">logout</span>
</div>
<div class="flex-1">
<p class="text-base font-semibold text-red-500 group-hover:text-red-400">Cerrar Sesión</p>
</div>
</button>
</section>
</div>
<!-- Bottom Navigation -->
<nav class="fixed bottom-0 left-0 w-full z-40 bg-background-dark/80 backdrop-blur-xl border-t border-white/10 pb-6 pt-3 px-6">
<ul class="flex justify-between items-center">
<li>
<a class="flex flex-col items-center gap-1 text-white/40 hover:text-white transition-colors" href="#">
<span class="material-symbols-outlined text-2xl">home</span>
<span class="text-[10px] font-medium">Inicio</span>
</a>
</li>
<li>
<a class="flex flex-col items-center gap-1 text-white/40 hover:text-white transition-colors" href="#">
<span class="material-symbols-outlined text-2xl">movie</span>
<span class="text-[10px] font-medium">Películas</span>
</a>
</li>
<li>
<a class="flex flex-col items-center gap-1 text-white/40 hover:text-white transition-colors" href="#">
<span class="material-symbols-outlined text-2xl">fastfood</span>
<span class="text-[10px] font-medium">Snacks</span>
</a>
</li>
<li>
<a class="flex flex-col items-center gap-1 text-primary animate-pulse" href="#">
<div class="bg-primary/20 px-4 py-1 rounded-full flex flex-col items-center">
<span class="material-symbols-outlined text-2xl font-bold fill-current">confirmation_number</span>
</div>
<span class="text-[10px] font-bold text-primary">Entradas</span>
</a>
</li>
</ul>
</nav>
</body></html>