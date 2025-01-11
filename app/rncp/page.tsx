'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Project42 {
  id: number
  project: {
    slug: string
    name: string
  }
  status: string
  validated?: boolean
  "final_mark": number | null
}

export default function RNCPPage() {
  const [activeOption, setActiveOption] = useState('web')
  const [userProjects, setUserProjects] = useState<Project42[]>([])
  const router = useRouter()
  const [simulatedMarks, setSimulatedMarks] = useState<{[key: string]: number}>({});
  const [pedagogicalEvents, setPedagogicalEvents] = useState<number>(0);
  const [userLevel, setUserLevel] = useState<number>(0);
  const [groupProjects, setGroupProjects] = useState<number>(0);
  const [professionalExperiences, setProfessionalExperiences] = useState<number>(0);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('accessToken')
        if (!token) {
          router.push('/')
          return
        }

        // D'abord récupérer les infos de l'utilisateur pour avoir son ID
        const userResponse = await fetch('https://api.intra.42.fr/v2/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (userResponse.status === 401) {
          // Gérer le refresh token
          const refreshToken = localStorage.getItem('refreshToken')
          if (refreshToken) {
            try {
              const refreshResponse = await fetch('/api/auth/refresh', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ refreshToken }),
              })

              if (refreshResponse.ok) {
                const newTokens = await refreshResponse.json()
                localStorage.setItem('accessToken', newTokens.access_token)
                localStorage.setItem('refreshToken', newTokens.refresh_token)
                // Réessayer la requête avec le nouveau token
                return fetchUserData()
              }
            } catch (error) {
              console.error('Erreur lors du rafraîchissement du token:', error)
            }
          }
          // Si le rafraîchissement échoue, rediriger vers la page de connexion
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
          router.push('/')
          return
        }

        if (!userResponse.ok) {
          throw new Error('Erreur lors de la récupération des informations utilisateur')
        }

        const userData = await userResponse.json()
        
        // Définir le level
        setUserLevel(userData.cursus_users.find((cursus: any) => 
          cursus.cursus_id === 21
        )?.level || 0);

        // Récupérer les projets
        const projectsResponse = await fetch(`https://api.intra.42.fr/v2/users/${userData.id}/projects_users`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        // Récupérer les événements
        const eventsResponse = await fetch(`https://api.intra.42.fr/v2/users/${userData.id}/events`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        // Récupérer les expériences (internships)
        const internshipsResponse = await fetch(`https://api.intra.42.fr/v2/users/${userData.id}/internships`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!internshipsResponse.ok) {
          throw new Error('Erreur lors de la récupération des stages')
        }

        const internshipsData = await internshipsResponse.json()
        setProfessionalExperiences(internshipsData.length)

        if (!eventsResponse.ok) {
          throw new Error('Erreur lors de la récupération des événements')
        }

        const eventsData = await eventsResponse.json()
        const pedagogicalEventsCount = eventsData.filter((event: any) => 
          event.event_type === "conference" || 
          event.event_type === "workshop" || 
          event.event_type === "hackathon" ||
          event.event_type === "extern" ||
          event.event_type === "association"
        ).length;
        setPedagogicalEvents(pedagogicalEventsCount)

        if (!projectsResponse.ok) {
          throw new Error('Erreur lors de la récupération des projets')
        }

        const projectsData = await projectsResponse.json()
        
        // Compter les projets de groupe validés
        const groupProjectsCount = projectsData.filter((project: any) => 
          project.project.solo === false && 
          project["validated?"] === true && 
          project.status === "finished"
        ).length;
        setGroupProjects(groupProjectsCount)

        setUserProjects(projectsData)
      } catch (error) {
        console.error('Erreur:', error)
        if (error instanceof Error && error.message.includes('401')) {
          router.push('/')
        }
      }
    }

    fetchUserData()
  }, [router])

  // Fonction pour vérifier si un projet est complété
  const isProjectCompleted = (projectId: string): boolean => {
    const project = userProjects.find(p => {
      const projectSlug = p.project.slug.toLowerCase();
      const searchSlug = projectId.toLowerCase();
      return projectSlug === searchSlug ||
             projectSlug === `42cursus-${searchSlug}` ||
             projectSlug.replace('42cursus-', '') === searchSlug ||
             projectSlug.replace(/[-_]/g, '') === searchSlug.replace(/[-_]/g, '') ||
             projectSlug.replace('42cursus-', '').replace(/[-_]/g, '') === searchSlug.replace(/[-_]/g, '');
    });

    // Vérifier d'abord la note simulée
    const simulatedMark = simulatedMarks[projectId];
    if (simulatedMark !== undefined) {
      return simulatedMark >= 75; // Considéré comme validé si >= 75
    }

    // Sinon utiliser la note réelle
    return project?.status === 'finished' && project["validated?"] === true;
  }

  // Fonction pour calculer l'XP totale et traiter les projets
  const processProjects = (projects: any[]) => {
    let totalXP = 0;
    
    const processedProjects = projects.map(project => {
      // Vérifier si le projet est validé et terminé
      const isValidated = project["validated?"] === true && project.status === "finished";
      const finalMark = project.final_mark;
      
      // Debug
      console.log(`Project ${project.project.name}:`, {
        isValidated,
        status: project.status,
        validated: project["validated?"],
        mark: finalMark
      });
      
      // Calculer l'XP
      if (isValidated && finalMark) {
        totalXP += finalMark * 100;
      }

      return {
        id: project.id,
        name: project.project.name,
        slug: project.project.slug,
        status: project.status,
        validated: isValidated,
        mark: finalMark,
        created_at: project.created_at,
        marked_at: project.marked_at
      };
    });

    return {
      projects: processedProjects,
      totalXP
    };
  };

  const [projectsData, setProjectsData] = useState({
    projects: [],
    totalXP: 0
  });

  useEffect(() => {
    const { projects, totalXP } = processProjects(userProjects);
    setProjectsData({ projects, totalXP });
  }, [userProjects]);

  const titles = {
    rncp6: {
      name: 'Titre RNCP 6',
      description: 'Titre homologué par le ministère du travail français, équivalent Licence (Bac+3)',
      requirements: {
        minLevel: 17,
        minGroupProjects: 2,
        minPedagogicalEvents: 10,
        minProfessionalExperiences: 2
      },
      commonCategories: {
        suite: {
          name: 'Projets Suite (1 requis)',
          requiredProjects: 1,
          projects: [
            { id: '42sh', name: '42sh', predecessor: 'minishell', completed: false },
            { id: 'badass', name: 'BADASS', predecessor: 'NetPractice', completed: false },
            { id: 'doom_nukem', name: 'DoomNukem', predecessor: 'cub3d', completed: false },
            { id: 'inception_of_things', name: 'Inception Of Things', predecessor: 'inception', completed: false },
            { id: 'human_gl', name: 'HumanGL', predecessor: 'scop', completed: false },
            { id: 'kfs_2', name: 'kfs-2', predecessor: 'kfs-1', completed: false },
            { id: 'override', name: 'Override', predecessor: 'rainfall', completed: false },
            { id: 'pestilence', name: 'Pestilence', predecessor: 'famine', completed: false },
            { id: 'rt', name: 'RT', predecessor: 'miniRT', completed: false },
            { id: 'total_perspective_vortex', name: 'Total perspective vortex', predecessor: 'dslr', completed: false }
          ]
        }
      },
      options: {
        web: {
          name: 'Développement web et mobile',
          categories: {
            web: {
              name: 'Web',
              requiredXP: 15000,
              requiredProjects: 2,
              projects: [
                { id: 'piscine_php_symfony', name: 'Piscine PHP Symfony', xp: 0, completed: false },
                { id: 'piscine_python_django', name: 'Piscine Python Django', xp: 0, completed: false },
                { id: 'piscine_ruby_rails', name: 'Piscine Ruby on Rails', xp: 0, completed: false },
                { id: 'camagru', name: 'Camagru', xp: 4200, completed: false },
                { id: 'matcha', name: 'Matcha', xp: 9450, completed: false },
                { id: 'hypertube', name: 'Hypertube', xp: 15750, completed: false },
                { id: 'red_tetris', name: 'Red Tetris', xp: 15750, completed: false },
                { id: 'darkly', name: 'Darkly', xp: 6300, completed: false },
                { id: 'h42n42', name: 'h42n42', xp: 9450, completed: false },
                { id: 'tokenizer', name: 'Tokenizer', xp: 9450, completed: false }
              ]
            },
            mobile: {
              name: 'Mobile',
              requiredXP: 10000,
              requiredProjects: 2,
              projects: [
                { id: 'ft_hangouts', name: 'ft_hangouts', xp: 4200, completed: false },
                { id: 'swifty_companion', name: 'Swifty_companion', xp: 4200, completed: false },
                { id: 'swifty_proteins', name: 'Swifty_proteins', xp: 15750, completed: false },
                { id: 'piscine_mobile', name: 'Piscine Mobile', xp: 0, completed: false }
              ]
            }
          }
        },
        app: {
          name: 'Développement applicatif',
          categories: {
            oop: {
              name: 'Object Oriented Programming',
              requiredXP: 10000,
              requiredProjects: 2,
              projects: [
                { id: 'bomberman', name: 'Bomberman', xp: 2000, completed: false },
                { id: 'nibbler', name: 'Nibbler', xp: 2000, completed: false },
                { id: 'avaj_launcher', name: 'Avaj launcher', xp: 2000, completed: false },
                { id: 'swingy', name: 'Swingy', xp: 2000, completed: false },
                { id: 'fix_me', name: 'fix-me', xp: 2000, completed: false },
                { id: 'piscine_object', name: 'Piscine Object', xp: 3000, completed: false }
              ]
            },
            functional: {
              name: 'Functional programming',
              requiredXP: 10000,
              requiredProjects: 2,
              projects: [
                { id: 'piscine_ocaml', name: 'Piscine OCaml', xp: 0, completed: false },
                { id: 'ft_turing', name: 'ft_turing', xp: 9450, completed: false },
                { id: 'ft_ality', name: 'ft_ality', xp: 4200, completed: false },
                { id: 'h42n42', name: 'h42n42', xp: 9450, completed: false }
              ]
            },
            imperative: {
              name: 'Imperative programming',
              requiredXP: 10000,
              requiredProjects: 2,
              projects: [
                { id: 'libasm', name: 'libasm', xp: 966, completed: false },
                { id: 'zappy', name: 'zappy', xp: 25200, completed: false },
                { id: 'gbmu', name: 'gbmu', xp: 0, completed: false },
                { id: 'ft_linux', name: 'ft_linux', xp: 4200, completed: false },
                { id: 'little_penguin', name: 'little penguin', xp: 9450, completed: false },
                { id: 'taskmaster', name: 'taskmaster', xp: 9450, completed: false },
                { id: 'strace', name: 'strace', xp: 9450, completed: false },
                { id: 'malloc', name: 'malloc', xp: 9450, completed: false },
                { id: 'matt_daemon', name: 'Matt Daemon', xp: 9450, completed: false },
                { id: 'nm', name: 'nm', xp: 9450, completed: false },
                { id: 'lem_ipc', name: 'lem_ipc', xp: 9450, completed: false },
                { id: 'kfs_1', name: 'kfs-1', xp: 15750, completed: false },
                { id: 'kfs_2', name: 'kfs-2', xp: 15750, completed: false },
                { id: 'ft_malcolm', name: 'ft_malcolm', xp: 6000, completed: false },
                { id: 'ft_ssl_md5', name: 'ft_ssl_md5', xp: 9450, completed: false },
                { id: 'darkly', name: 'Darkly', xp: 6300, completed: false },
                { id: 'snowcrash', name: 'Snowcrash', xp: 9450, completed: false },
                { id: 'rainfall', name: 'Rainfall', xp: 25200, completed: false },
                { id: 'override', name: 'Override', xp: 35700, completed: false },
                { id: 'boot2root', name: 'Boot2root', xp: 11500, completed: false },
                { id: 'ft_shield', name: 'Ft_Shield', xp: 15750, completed: false },
                { id: 'durex', name: 'Durex', xp: 0, completed: false },
                { id: 'woody_woodpacker', name: 'Woody Woodpacker', xp: 9450, completed: false },
                { id: 'famine', name: 'Famine', xp: 9450, completed: false },
                { id: 'pestilence', name: 'Pestilence', xp: 15750, completed: false }
              ]
            }
          }
        }
      }
    },
    rncp7: {
      name: 'Titre RNCP 7',
      description: 'Titre homologué par le ministère du travail français, équivalent Master (Bac+5)',
      requirements: {
        minLevel: 21,
        minGroupProjects: 2,
        minPedagogicalEvents: 15,
        minProfessionalExperiences: 2
      },
      commonCategories: {
        suite: {
          name: 'Projets Suite (1 requis)',
          requiredProjects: 1,
          projects: [
            { id: '42sh', name: '42sh', predecessor: 'minishell', completed: false },
            { id: 'badass', name: 'BADASS', predecessor: 'NetPractice', completed: false },
            { id: 'doom_nukem', name: 'DoomNukem', predecessor: 'cub3d', completed: false },
            { id: 'inception_of_things', name: 'Inception Of Things', predecessor: 'inception', completed: false },
            { id: 'human_gl', name: 'HumanGL', predecessor: 'scop', completed: false },
            { id: 'kfs_2', name: 'kfs-2', predecessor: 'kfs-1', completed: false },
            { id: 'override', name: 'Override', predecessor: 'rainfall', completed: false },
            { id: 'pestilence', name: 'Pestilence', predecessor: 'famine', completed: false },
            { id: 'rt', name: 'RT', predecessor: 'miniRT', completed: false },
            { id: 'total_perspective_vortex', name: 'Total perspective vortex', predecessor: 'dslr', completed: false }
          ]
        }
      },
      options: {
        sys: {
          name: 'Système d\'information et réseaux',
          categories: {
            unix: {
              name: 'Unix/Kernel',
              requiredXP: 30000,
              requiredProjects: 2,
              projects: [
                { id: 'libasm', name: 'LibASM', xp: 966, completed: false },
                { id: 'zappy', name: 'Zappy', xp: 25200, completed: false },
                { id: 'gbmu', name: 'GBMU', xp: 0, completed: false },
                { id: 'ft_linux', name: 'ft_linux', xp: 4200, completed: false },
                { id: 'little_penguin', name: 'Little Penguin', xp: 9450, completed: false },
                { id: 'taskmaster', name: 'Taskmaster', xp: 9450, completed: false },
                { id: 'strace', name: 'Strace', xp: 9450, completed: false },
                { id: 'malloc', name: 'Malloc', xp: 9450, completed: false },
                { id: 'matt_daemon', name: 'Matt Daemon', xp: 9450, completed: false },
                { id: 'nm', name: 'NM', xp: 9450, completed: false },
                { id: 'lem_ipc', name: 'Lem-IPC', xp: 9450, completed: false },
                { id: 'kfs_1', name: 'KFS 1', xp: 15750, completed: false },
                { id: 'kfs_2', name: 'KFS 2', xp: 15750, completed: false },
                { id: 'kfs_3', name: 'KFS 3', xp: 35700, completed: false },
                { id: 'kfs_4', name: 'KFS 4', xp: 25200, completed: false },
                { id: 'kfs_5', name: 'KFS 5', xp: 35700, completed: false },
                { id: 'kfs_6', name: 'KFS 6', xp: 25200, completed: false },
                { id: 'kfs_7', name: 'KFS 7', xp: 35700, completed: false },
                { id: 'kfs_8', name: 'KFS 8', xp: 15750, completed: false },
                { id: 'kfs_9', name: 'KFS 9', xp: 15750, completed: false },
                { id: 'kfs_x', name: 'KFS X', xp: 35700, completed: false }
              ]
            },
            sysadmin: {
              name: 'System administration',
              requiredXP: 50000,
              requiredProjects: 3,
              projects: [
                { id: 'cloud1', name: 'Cloud-1', xp: 9450, completed: false },
                { id: 'badass', name: 'BADASS', xp: 0, predecessor: 'netpractice', completed: false },
                { id: 'inception_of_things', name: 'Inception Of Things', xp: 25450, predecessor: 'inception', completed: false },
                { id: 'taskmaster', name: 'Taskmaster', xp: 9450, completed: false },
                { id: 'ft_ping', name: 'ft_ping', xp: 4200, completed: false },
                { id: 'ft_traceroute', name: 'ft_traceroute', xp: 4200, completed: false },
                { id: 'ft_nmap', name: 'ft_nmap', xp: 15750, completed: false },
                { id: 'active_directory', name: 'Active Directory', xp: 0, completed: false },
                { id: 'automatic_directory', name: 'Automatic Directory', xp: 0, completed: false },
                { id: 'administrative_directory', name: 'Administrative Directory', xp: 0, completed: false },
                { id: 'accessible_directory', name: 'Accessible Directory', xp: 0, completed: false }
              ]
            },
            security: {
              name: 'Security',
              requiredXP: 50000,
              requiredProjects: 3,
              projects: [
                { id: 'ft_malcolm', name: 'ft_malcolm', xp: 6000, completed: false },
                { id: 'ft_ssl_md5', name: 'ft_ssl_md5', xp: 9450, completed: false },
                { id: 'darkly', name: 'Darkly', xp: 6300, completed: false },
                { id: 'snowcrash', name: 'Snowcrash', xp: 9450, completed: false },
                { id: 'rainfall', name: 'Rainfall', xp: 25200, completed: false },
                { id: 'override', name: 'Override', xp: 35700, completed: false },
                { id: 'boot2root', name: 'Boot2root', xp: 11500, completed: false },
                { id: 'ft_shield', name: 'ft_shield', xp: 15750, completed: false },
                { id: 'woody_woodpacker', name: 'Woody Woodpacker', xp: 9450, completed: false },
                { id: 'famine', name: 'Famine', xp: 9450, completed: false },
                { id: 'pestilence', name: 'Pestilence', xp: 15750, completed: false },
                { id: 'piscine_cybersecurity', name: 'Piscine Cybersecurity', xp: 0, completed: false },
                { id: 'unleashthebox', name: 'UnleashTheBox', xp: 15750, completed: false },
                { id: 'active_connect', name: 'Active Connect', xp: 0, completed: false },
                { id: 'microforensx', name: 'MicroForensX', xp: 0, completed: false },
                { id: 'activetechtales', name: 'ActiveTechTales', xp: 0, completed: false }
              ]
            }
          }
        },
        data: {
          name: 'Architecture des bases de données et data',
          categories: {
            web: {
              name: 'Web - Database',
              requiredXP: 50000,
              requiredProjects: 2,
              projects: [
                { id: 'piscine_php_symfony', name: 'Piscine PHP Symfony', xp: 0, completed: false },
                { id: 'piscine_python_django', name: 'Piscine Python Django', xp: 0, completed: false },
                { id: 'piscine_ruby_rails', name: 'Piscine Ruby on Rails', xp: 0, completed: false },
                { id: 'camagru', name: 'Camagru', xp: 4200, completed: false },
                { id: 'matcha', name: 'Matcha', xp: 9450, completed: false },
                { id: 'hypertube', name: 'Hypertube', xp: 15750, completed: false },
                { id: 'red_tetris', name: 'Red Tetris', xp: 15750, completed: false },
                { id: 'darkly', name: 'Darkly', xp: 6300, completed: false },
                { id: 'h42n42', name: 'h42n42', xp: 9450, completed: false },
                { id: 'tokenizer', name: 'Tokenizer', xp: 9450, completed: false }
              ]
            },
            ai: {
              name: 'Artificial Intelligence',
              requiredXP: 70000,
              requiredProjects: 3,
              projects: [
                { id: 'piscine_ml', name: 'Piscine Machine Learning', xp: 0, completed: false },
                { id: 'linear_regression', name: 'Linear regression', xp: 4200, completed: false },
                { id: 'dslr', name: 'DSLR', xp: 6000, completed: false },
                { id: 'multilayer_perceptron', name: 'Multi layer perceptron', xp: 9450, completed: false },
                { id: 'gomoku', name: 'Gomoku', xp: 25200, completed: false },
                { id: 'total_perspective_vortex', name: 'Total perspective vortex', xp: 9450, completed: false },
                { id: 'expert_system', name: 'Expert system', xp: 9450, completed: false },
                { id: 'krpsim', name: 'Krpsim', xp: 9450, completed: false },
                { id: 'matrix', name: 'Matrix', xp: 7000, completed: false },
                { id: 'ready_set_boole', name: 'Ready set boole', xp: 7000, completed: false },
                { id: 'leaffliction', name: 'Leaffliction', xp: 15750, completed: false },
                { id: 'piscine_data_science', name: 'Piscine Data Science', xp: 0, completed: false },
                { id: 'piscine_python_ds', name: 'Piscine Python for Data Science', xp: 0, completed: false }
              ]
            }
          }
        }
      }
    }
  }

  const getActiveOptionData = () => {
    for (const [titleId, title] of Object.entries(titles)) {
      if (Object.keys(title.options).includes(activeOption)) {
        // Mettre à jour l'état completed des projets
        const updatedTitle = {
          ...title,
          commonCategories: {
            ...title.commonCategories,
            suite: {
              ...title.commonCategories.suite,
              projects: title.commonCategories.suite.projects.map(project => ({
                ...project,
                completed: isProjectCompleted(project.id)
              }))
            }
          },
          options: {
            ...title.options,
            [activeOption]: {
              ...title.options[activeOption],
              categories: Object.fromEntries(
                Object.entries(title.options[activeOption].categories).map(([catId, category]) => [
                  catId,
                  {
                    ...category,
                    projects: category.projects.map(project => ({
                      ...project,
                      completed: isProjectCompleted(project.id)
                    }))
                  }
                ])
              )
            }
          }
        }

        return {
          titleId,
          titleName: updatedTitle.name,
          option: updatedTitle.options[activeOption]
        }
      }
    }
    return null
  }

  const activeData = getActiveOptionData()

  // Ajouter cette fonction pour gérer les changements de notes
  const handleMarkChange = (projectId: string, mark: number) => {
    // Limiter la note entre 0 et 125
    const validMark = Math.min(Math.max(mark, 0), 125);
    setSimulatedMarks(prev => ({
      ...prev,
      [projectId]: validMark
    }));
  };

  // Ajouter cette fonction pour calculer l'XP d'un projet
  const calculateProjectXP = (project: any, mark: number): number => {
    if (mark < 75) {
      return 0; // Projet non validé
    }
    
    // L'XP de base est calculé sur une note de 100
    let xp = project.xp;
    
    // Si la note est supérieure à 100, ajouter un bonus
    if (mark > 100) {
      // Le bonus est proportionnel aux points au-dessus de 100 (max 25% bonus)
      const bonusPercentage = (mark - 100) / 100;  // 25 points = 25% bonus
      xp += project.xp * bonusPercentage;
    }
    
    return Math.round(xp);
  };

  // Ajouter cette fonction pour calculer l'XP total d'une catégorie
  const calculateCategoryXP = (projects: any[]): number => {
    return projects.reduce((total, project) => {
      const mark = simulatedMarks[project.id] !== undefined 
        ? simulatedMarks[project.id] 
        : (userProjects.find(p => {
            const projectSlug = p.project.slug.toLowerCase();
            const searchSlug = project.id.toLowerCase();
            return projectSlug === searchSlug ||
                   projectSlug === `42cursus-${searchSlug}` ||
                   projectSlug.replace('42cursus-', '') === searchSlug ||
                   projectSlug.replace(/[-_]/g, '') === searchSlug.replace(/[-_]/g, '') ||
                   projectSlug.replace('42cursus-', '').replace(/[-_]/g, '') === searchSlug.replace(/[-_]/g, '');
          })?.final_mark || 0);
      
      return total + calculateProjectXP(project, mark);
    }, 0);
  };

  return (
    <div className="p-8 space-y-8">
      {/* Les deux titres RNCP côte à côte */}
      <div className="grid grid-cols-2 gap-4">
        {Object.entries(titles).map(([titleId, title]) => (
          <div key={titleId} className="p-6 bg-gray-100 rounded-lg shadow">
            <h2 className="text-2xl font-bold">{title.name}</h2>
          </div>
        ))}
      </div>
      
      {/* Options côte à côte */}
      <div className="flex gap-4">
        {Object.entries(titles).flatMap(([titleId, title]) =>
          Object.entries(title.options).map(([optionId, option]) => (
            <button
              key={`${titleId}-${optionId}`}
              onClick={() => setActiveOption(optionId)}
              className={`p-4 rounded-lg text-left transition-colors flex-1 ${
                activeOption === optionId
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {option.name}
            </button>
          ))
        )}
      </div>

      {/* Section de progression */}
      {activeData && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-6">
            {activeData.titleName} - {activeData.option.name}
          </h3>
          
          {/* Prérequis communs */}
          <div className="mb-8">
            <h4 className="font-semibold mb-4">Prérequis communs</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between">
                  <span>Level minimum</span>
                  <span className={userLevel >= (activeData.titleId === 'rncp6' ? 17 : 21) ? 'text-green-600' : 'text-red-600'}>
                    {userLevel.toFixed(2)} / {activeData.titleId === 'rncp6' ? '17' : '21'}
                  </span>
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between">
                  <span>Projets de groupe</span>
                  <span className={groupProjects >= 2 ? 'text-green-600' : 'text-red-600'}>
                    {groupProjects} / 2 minimum
                  </span>
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between">
                  <span>Événements pédagogiques</span>
                  <span className={pedagogicalEvents >= (activeData.titleId === 'rncp6' ? 10 : 15) ? 'text-green-600' : 'text-red-600'}>
                    {pedagogicalEvents} / {activeData.titleId === 'rncp6' ? '10' : '15'} minimum
                  </span>
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between">
                  <span>Expériences professionnelles</span>
                  <span className={professionalExperiences >= 2 ? 'text-green-600' : 'text-red-600'}>
                    {professionalExperiences} / 2 minimum
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Toutes les catégories en colonnes */}
          <div className={`grid gap-6`} style={{
            gridTemplateColumns: `repeat(${Object.keys(activeData.option.categories).length + 1}, 1fr)`
          }}>
            {/* Catégorie Suite */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-lg mb-4 text-center">
                Projets Suite
              </h4>
              
              {/* Informations de la catégorie */}
              <div className="bg-white rounded p-3 mb-4">
                <div className="text-sm text-gray-600 mb-2">
                  <div className="flex justify-between">
                    <span>Projets requis :</span>
                    <span className={titles[activeData.titleId].commonCategories.suite.projects.filter(p => p.completed).length >= 1 ? 'text-green-600' : 'text-red-600'}>
                      {titles[activeData.titleId].commonCategories.suite.projects.filter(p => p.completed).length} / 1
                    </span>
                  </div>
                </div>
                
                {/* Barre de progression */}
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${titles[activeData.titleId].commonCategories.suite.projects.filter(p => p.completed).length >= 1 ? 'bg-green-600' : 'bg-blue-600'}`}
                    style={{ 
                      width: `${titles[activeData.titleId].commonCategories.suite.projects.filter(p => p.completed).length >= 1 ? '100' : '0'}%` 
                    }}
                  ></div>
                </div>
              </div>

              {/* Liste des projets */}
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {titles[activeData.titleId].commonCategories.suite.projects.map(project => {
                  const userProject = userProjects.find(p => {
                    const projectSlug = p.project.slug.toLowerCase();
                    const searchSlug = project.id.toLowerCase();
                    return projectSlug === searchSlug ||
                           projectSlug === `42cursus-${searchSlug}` ||
                           projectSlug.replace('42cursus-', '') === searchSlug ||
                           projectSlug.replace(/[-_]/g, '') === searchSlug.replace(/[-_]/g, '') ||
                           projectSlug.replace('42cursus-', '').replace(/[-_]/g, '') === searchSlug.replace(/[-_]/g, '');
                  });

                  const currentMark = simulatedMarks[project.id] !== undefined 
                    ? simulatedMarks[project.id] 
                    : (userProject?.final_mark || 0);

                  return (
                    <div 
                      key={project.id}
                      className={`p-3 rounded border ${
                        isProjectCompleted(project.id)
                          ? 'bg-green-50 border-green-200' 
                          : 'bg-white border-gray-200'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex flex-col">
                          <span className="font-medium text-sm">{project.name}</span>
                          {project.predecessor && (
                            <span className="text-xs text-gray-500">
                              Prérequis: {project.predecessor}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="0"
                            max="125"
                            value={currentMark}
                            onChange={(e) => handleMarkChange(project.id, Number(e.target.value))}
                            className="w-16 text-right px-2 py-1 border rounded text-sm"
                          />
                          <span className="text-sm font-medium">/125</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Autres catégories */}
            {Object.entries(activeData.option.categories).map(([catId, category]) => {
              const categoryXP = calculateCategoryXP(category.projects);
              const xpProgress = Math.min((categoryXP / category.requiredXP) * 100, 100);
              
              // Calculer le nombre de projets validés dans la catégorie
              const completedProjects = category.projects.filter(project => 
                isProjectCompleted(project.id)
              ).length;
              
              return (
                <div key={catId} className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-lg mb-4 text-center">
                    {category.name}
                  </h4>
                  
                  {/* Informations de la catégorie */}
                  <div className="bg-white rounded p-3 mb-4">
                    <div className="text-sm text-gray-600 mb-2">
                      <div className="flex justify-between">
                        <span>Projets requis :</span>
                        <span className={completedProjects >= category.requiredProjects ? 'text-green-600' : 'text-red-600'}>
                          {completedProjects} / {category.requiredProjects}
                        </span>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 mb-3">
                      <div className="flex justify-between">
                        <span>XP :</span>
                        <span className={categoryXP >= category.requiredXP ? 'text-green-600' : 'text-red-600'}>
                          {categoryXP} / {category.requiredXP}
                        </span>
                      </div>
                    </div>
                    
                    {/* Barre de progression */}
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${categoryXP >= category.requiredXP ? 'bg-green-600' : 'bg-blue-600'}`}
                        style={{ 
                          width: `${xpProgress}%` 
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Liste des projets */}
                  <div className="space-y-2 max-h-[600px] overflow-y-auto">
                    {category.projects.map(project => {
                      const userProject = userProjects.find(p => {
                        const projectSlug = p.project.slug.toLowerCase();
                        const searchSlug = project.id.toLowerCase();
                        return projectSlug === searchSlug ||
                               projectSlug === `42cursus-${searchSlug}` ||
                               projectSlug.replace('42cursus-', '') === searchSlug ||
                               projectSlug.replace(/[-_]/g, '') === searchSlug.replace(/[-_]/g, '') ||
                               projectSlug.replace('42cursus-', '').replace(/[-_]/g, '') === searchSlug.replace(/[-_]/g, '');
                      });

                      const currentMark = simulatedMarks[project.id] !== undefined 
                        ? simulatedMarks[project.id] 
                        : (userProject?.final_mark || 0);

                      return (
                        <div 
                          key={project.id}
                          className={`p-3 rounded border ${
                            isProjectCompleted(project.id)
                              ? 'bg-green-50 border-green-200' 
                              : 'bg-white border-gray-200'
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <div className="flex flex-col">
                              <span className="font-medium text-sm">{project.name}</span>
                              <div className="flex justify-between items-center mt-1">
                                <span className="text-xs text-gray-500">{project.xp} XP</span>
                                {project.predecessor && (
                                  <span className="text-xs text-gray-500 ml-2">
                                    Prérequis: {project.predecessor}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                min="0"
                                max="125"
                                value={currentMark}
                                onChange={(e) => handleMarkChange(project.id, Number(e.target.value))}
                                className="w-16 text-right px-2 py-1 border rounded text-sm"
                              />
                              <span className="text-sm font-medium">/125</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  )
}
