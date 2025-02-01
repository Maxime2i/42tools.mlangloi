'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUserStore } from '@/store/userStore'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import ProtectedRoute from '@/components/ProtectedRoute'
import { availableProjects, titles } from './data'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"
import { Carousel, CarouselItem, CarouselContent, CarouselPrevious, CarouselNext } from "@/components/ui/carousel"

export interface Project42 {
  id?: string
  name?: string
  xp?: number
  mark?: number
  hours?: number
  group?: boolean
  validated?: boolean
  status?: string
  project?: {
    id: number
    name: string
    slug: string
  }
  final_mark?: number
  subProjects?: any[]
}

type Project = {
  id: string;
  name: string;
  completed: boolean;
  // Ajoutez d'autres propriétés si nécessaire
};

type Category = {
  name: string;
  projects: Project[];
};

type Option = {
  name: string;
  categories: Record<string, Category>;
};

type Title = {
  name: string;
  options: Record<string, Option>;
};

type Titles = Record<string, Title>;

export default function RNCPPage() {
  const [activeOption, setActiveOption] = useState('web')
  const [userProjects, setUserProjects] = useState<Project42[]>([])
  const router = useRouter()
  const [simulatedMarks, setSimulatedMarks] = useState<{[key: string]: number}>({});
  const [pedagogicalEvents, setPedagogicalEvents] = useState<number>(0);
  const [userLevel, setUserLevel] = useState<number>(0);
  const [groupProjects, setGroupProjects] = useState<number>(0);
  const [professionalExperiences, setProfessionalExperiences] = useState<number>(0);
  const { userInfo, fetchUserInfo } = useUserStore()
  const [updateTrigger, setUpdateTrigger] = useState(0);
  const [showSubProjects, setShowSubProjects] = useState<{ [key: string]: boolean }>({}); // État pour gérer l'affichage des sous-projets
  const [isDrawerOpen, setIsDrawerOpen] = useState(false); // État pour gérer l'ouverture du Drawer



  useEffect(() => {
    const initializeUserData = async () => {
      const accessToken = localStorage.getItem('accessToken')
      const isGuestMode = localStorage.getItem('guestMode')

      if (!accessToken && !isGuestMode) {
        router.push('/')
        return
      }

      if (!isGuestMode && !userInfo) {
        try {
          await fetchUserInfo()
        } catch (error) {
          console.error('Erreur:', error)
          router.push('/')
        }
      }
    }

    initializeUserData()
  }, [userInfo, fetchUserInfo, router])

  useEffect(() => {
    if (userInfo) {
      setUserLevel(userInfo.cursus_users?.find((cursus: any) => 
        cursus.cursus_id === 21
      )?.level || 0)

      if (userInfo.projects_users) {
        setUserProjects(userInfo.projects_users)

        const validatedProjects = userInfo.projects_users.filter((project: any) => 
          project.status === "finished" && 
          project.validated === true
        );

        const groupProjectsCount = validatedProjects.reduce((count, userProject) => {
          const projectInList = availableProjects.find(p => {
            const normalizedUserSlug = userProject.project.slug.toLowerCase()
              .replace('42cursus-', '')
              .replace(/[-_]/g, '');
            const normalizedListSlug = p?.id?.toLowerCase()
              .replace(/[-_]/g, '');
            return normalizedUserSlug === normalizedListSlug;
          });

          return projectInList?.group ? count + 1 : count;
        }, 0);

        setGroupProjects(groupProjectsCount);
      }

      if (userInfo.events) {
        setPedagogicalEvents(userInfo.events.length)
      }

      const validProfessionalSlugs = [
        '42cursus-startup-internship',
        'internship-ii',
        'internship-i',
        'apprentissage-1-an',
        '42cursus-apprentissage-2-ans-1ere-annee',
        'apprentissage-2-ans-2eme-annee',
      ];

      if (userInfo.projects_users) {
        const professionalProjectsCount = userInfo.projects_users.filter((project: any) => {
          const projectSlug = project.project.slug.toLowerCase();
          return validProfessionalSlugs.includes(projectSlug) &&
                 project.status === "finished" &&
                 project.validated === true;
        }).length;

        const internshipsCount = userInfo.internships?.length || 0;

        setProfessionalExperiences(professionalProjectsCount + internshipsCount);
      }
    }
  }, [userInfo, availableProjects]);

  const isProjectCompleted = (projectId: string): boolean => {
    const project = userProjects.find(p => {
      const projectSlug = p?.project?.slug.toLowerCase();
      const searchSlug = projectId.toLowerCase();
      return projectSlug === searchSlug ||
             projectSlug?.replace('42cursus-', '') === searchSlug ||
             projectSlug?.replace(/[-_]/g, '') === searchSlug.replace(/[-_]/g, '') ||
             projectSlug?.replace('42cursus-', '').replace(/[-_]/g, '') === searchSlug.replace(/[-_]/g, '');
    });

    const simulatedMark = simulatedMarks[projectId];
    if (simulatedMark !== undefined) {
      return simulatedMark >= 75;
    }

    return project?.status === 'finished' && project.validated === true;
  }

  

  const getActiveOptionData = (titles: Titles, activeOption: string) => {
    for (const [titleId, title] of Object.entries(titles)) {
      if (title.options[activeOption]) {
        const updatedTitle = {
          ...title,
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

  const activeData = getActiveOptionData(titles, activeOption)

  const handleMarkChange = (projectId: string, mark: number) => {
    const validMark = Math.min(Math.max(mark, 0), 125);
    setSimulatedMarks(prev => ({
      ...prev,
      [projectId]: validMark
    }));
    setUpdateTrigger(prev => prev + 1);
  };

 

  const calculateCategoryXP = (projects: any[]): number => {
    return projects.reduce((total, project) => {
      const mark = getProjectMark(project.id);
      let projectXP = 0;

      // Calculer l'XP pour le projet principal
      if (mark >= 75) {
        projectXP = project.xp;
        if (mark > 100) {
          const bonusPercentage = (mark - 100) / 100;
          projectXP += project.xp * bonusPercentage;
        }
        total += projectXP;
      }

      // Calculer l'XP pour les sous-projets
      if (project.subProjects) {
        project.subProjects.forEach((subProject: any) => {
          const subMark = getProjectMark(subProject.id);
          if (subMark >= 75) {
            let subXP = subProject.xp;
            if (subMark > 100) {
              const bonusPercentage = (subMark - 100) / 100;
              subXP += subProject.xp * bonusPercentage;
            }
            total += subXP;
          }
        });
      }

      return total;
    }, 0);
  };

  const getProjectMark = (projectId: string): number => {
    if (simulatedMarks[projectId] !== undefined) {
      return simulatedMarks[projectId];
    }

    const project = userProjects.find(p => {
      const projectSlug = p?.project?.slug.toLowerCase();
      const searchSlug = projectId.toLowerCase();
      return projectSlug === searchSlug ||
             projectSlug === `42cursus-${searchSlug}` ||
             projectSlug?.replace('42cursus-', '') === searchSlug ||
             projectSlug?.replace(/[-_]/g, '') === searchSlug.replace(/[-_]/g, '') ||
             projectSlug?.replace('42cursus-', '').replace(/[-_]/g, '') === searchSlug.replace(/[-_]/g, '');
    });

    return project?.final_mark || 0;
  };

  return (
    <ProtectedRoute>
    <div className="min-h-screen bg-black text-white p-4 md:p-8 space-y-4 md:space-y-8">
      <h1 className="hidden md:block text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-300 to-gray-500">
        Titres RNCP
      </h1>

      <div className="hidden md:flex flex-col gap-4">
      {/* Les deux titres RNCP */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(titles).map(([titleId, title]) => (
          <Card key={titleId} className="border-white/10 bg-zinc-900/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-2xl font-light tracking-tight text-white">
                {title.name}
              </CardTitle>
              <p className="text-sm text-gray-400">{title.description}</p>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {Object.entries(titles.rncp6.options).map(([optionId, option]) => (
            <Button
              key={`rncp6-${optionId}`}
              onClick={() => setActiveOption(optionId)}
              variant={activeOption === optionId ? "secondary" : "default"}
              className={`flex-1 ${
                activeOption === optionId 
                  ? "bg-white text-black hover:bg-gray-200" 
                  : "bg-transparent text-white border border-white/10 hover:bg-white/10"
              }`}
            >
              {option.name}
            </Button>
          ))}
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          {Object.entries(titles.rncp7.options).map(([optionId, option]) => (
            <Button
              key={`rncp7-${optionId}`}
              onClick={() => setActiveOption(optionId)}
              variant={activeOption === optionId ? "secondary" : "default"}
              className={`flex-1 ${
                activeOption === optionId 
                  ? "bg-white text-black hover:bg-gray-200" 
                  : "bg-transparent text-white border border-white/10 hover:bg-white/10"
              }`}
            >
              {option.name}
            </Button>
          ))}
        </div>
      </div>
      </div>


      <div className="md:hidden flex flex-col gap-4">
      {/* Les deux titres RNCP */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(titles).map(([titleId, title], index) => (
          index === 0 && (
            <Card key={titleId} className="border-white/10 bg-zinc-900/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-2xl font-light tracking-tight text-white">
                  {title.name}
                </CardTitle>
                <p className="text-sm text-gray-400">{title.description}</p>
              </CardHeader>
            </Card>
          )
        ))}
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {Object.entries(titles.rncp6.options).map(([optionId, option]) => (
            <Button
              key={`rncp6-${optionId}`}
              onClick={() => setActiveOption(optionId)}
              variant={activeOption === optionId ? "secondary" : "default"}
              className={`flex-1 ${
                activeOption === optionId 
                  ? "bg-white text-black hover:bg-gray-200" 
                  : "bg-transparent text-white border border-white/10 hover:bg-white/10"
              }`}
            >
              {option.name}
            </Button>
          ))}
        </div>


        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(titles).map(([titleId, title], index) => (
          index === 1 && (
            <Card key={titleId} className="border-white/10 bg-zinc-900/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-2xl font-light tracking-tight text-white">
                  {title.name}
                </CardTitle>
                <p className="text-sm text-gray-400">{title.description}</p>
              </CardHeader>
            </Card>
          )
        ))}
      </div>
        <div className="flex flex-col sm:flex-row gap-4">
          {Object.entries(titles.rncp7.options).map(([optionId, option]) => (
            <Button
              key={`rncp7-${optionId}`}
              onClick={() => setActiveOption(optionId)}
              variant={activeOption === optionId ? "secondary" : "default"}
              className={`flex-1 ${
                activeOption === optionId 
                  ? "bg-white text-black hover:bg-gray-200" 
                  : "bg-transparent text-white border border-white/10 hover:bg-white/10"
              }`}
            >
              {option.name}
            </Button>
          ))}
        </div>
      </div>
      </div>

      {/* Section de progression */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="border-white/10 bg-zinc-800/50">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row justify-between items-center">
              <span className="text-gray-400">Level minimum</span>
              <Badge variant={userLevel >= (activeData?.titleId === 'rncp6' ? 17 : 21) ? "success" : "destructive"}>
                {userLevel.toFixed(2)} / {activeData?.titleId === 'rncp6' ? '17' : '21'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-zinc-800/50">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row justify-between items-center">
              <span className="text-gray-400">Projets de groupe</span>
              <Badge variant={groupProjects >= 2 ? "success" : "destructive"}>
                {groupProjects} / 2
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-zinc-800/50">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row justify-between items-center">
              <div className="flex flex-row">
                <span className="text-gray-400">Événements pédagogiques</span>
                <button onClick={() => setIsDrawerOpen(true)} className="ml-2 text-white cursor-pointer">(voir)</button>
              </div>
              <div className="flex items-center">
                <Badge variant={pedagogicalEvents >= (activeData?.titleId === 'rncp6' ? 10 : 15) ? "success" : "destructive"}>
                  {pedagogicalEvents} / {activeData?.titleId === 'rncp6' ? '10' : '15'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-zinc-800/50">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row justify-between items-center">
              <span className="text-gray-400">Expériences professionnelles</span>
              <Badge variant={professionalExperiences >= 2 ? "success" : "destructive"}>
                {professionalExperiences} / 2
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Drawer pour afficher les détails des événements pédagogiques */}
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent className="bg-zinc-900/50 backdrop-blur flex justify-center items-center">
          <div className="max-w-md w-full">
            <DrawerHeader>
              <DrawerTitle className="text-white text-center">Détails des événements pédagogiques</DrawerTitle>
            </DrawerHeader>
            <Carousel opts={{
              align: "start",
              loop: true,
            }}>
              <CarouselContent>
                {userInfo?.events.map((event: any) => (
                  <CarouselItem key={event.event.id}>
                    <Card className="border-white/10 bg-zinc-800/50 mb-4">
                      <CardContent className="p-4">
                        <h6 className="text-white text-center mb-4">{event.event.name}</h6>
                        <p className="text-white">{event.event.description.substring(0, 200) + "..."}</p>
                        <div className="flex justify-end gap-2 mt-2">
                          <Badge >{event.event.kind}</Badge>
                          <Badge>{event.event.location}</Badge>
                          <Badge>{event.event.begin_at.split('T')[0]}</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </DrawerContent>
      </Drawer>

      {/* Catégories de projets */}
      <div className={`grid gap-4 ${
        activeData?.option.categories 
          ? Object.keys(activeData.option.categories).length === 2 
            ? 'grid-cols-1 sm:grid-cols-2' 
            : Object.keys(activeData.option.categories).length === 3 
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
            : 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-4'
          : 'grid-cols-1' // Valeur par défaut si categories est undefined
      }`}>
        {/* Pour chaque catégorie */}
        {activeData?.option.categories ? (
          Object.entries(activeData.option.categories).map(([catId, category]: [string, any]) => (
            <Card key={catId} className="border-white/10 bg-zinc-800/50">
              <CardHeader>
                <CardTitle className="text-lg font-medium text-white">
                  {category.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Stats de la catégorie */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">XP</span>
                    <span className="text-white">{calculateCategoryXP(category.projects)} / {category.requiredXP}</span>
                  </div>
                  <Progress 
                    key={updateTrigger}
                    value={(calculateCategoryXP(category.projects) / category.requiredXP) * 100} 
                    className="h-2 bg-white/10" 
                    indicatorClassName={cn(
                      "transition-all duration-500",
                      calculateCategoryXP(category.projects) >= category.requiredXP
                        ? "bg-gradient-to-r from-green-700 to-green-300"
                        : "bg-gradient-to-r from-red-900 to-red-500"
                    )}
                  />
                </div>

                {/* Liste des projets */}
                <div className="space-y-2">
                  {category.projects.map((project: any) => {
                    const isSubProjectVisible = showSubProjects[project.id] || false; // Vérifiez si les sous-projets doivent être affichés

                    const handleToggleSubProjects = () => {
                      setShowSubProjects(prev => ({
                        ...prev,
                        [project.id]: !prev[project.id] // Basculez l'état pour ce projet
                      }));
                    };


                    return (
                      <Card key={project.id} className={`border-white/10 ${
                        isProjectCompleted(project.id) ? 'bg-emerald-900/30' : 'bg-zinc-900/60'
                      }`}>
                        <CardContent className="p-4">
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                            <div className="w-full sm:w-auto flex items-center">
                              {project.subProjects && project.subProjects.length > 0 && (
                                <button onClick={handleToggleSubProjects} className="mr-2">
                                  {isSubProjectVisible ? '▼' : '►'} 
                                </button>
                              )}
                              <p className="text-sm font-medium text-white">{project.name}</p>
                              {project.xp ? <p className="text-xs text-gray-400 ml-2">- {project.xp} XP</p> : null}
                         
                            </div>
                            <div className="flex items-center gap-2 w-full sm:w-auto">
                              <Input
                                type="number"
                                min="0"
                                max="125"
                                value={getProjectMark(project.id)}
                                onChange={(e) => handleMarkChange(project.id, Number(e.target.value))}
                                className="w-10 sm:w-10 h-8 text-center text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none p-0"
                              />
                            </div>
                          </div>
                          {/* Affichage des sous-projets si isSubProjectVisible est vrai */}
                          {isSubProjectVisible && project.subProjects && project.subProjects.length > 0 && (
                            <div className="mt-2 space-y-2">
                              {project.subProjects.map((subProject: any) => (
                                <Card key={subProject.id} className="border-white/10 bg-zinc-800/50">
                                  <CardContent className="p-2">
                                    <div className="flex items-center justify-between">
                                      <div className="">
                                        <p className="text-sm font-medium text-white">{subProject.name}</p>
                                        <p className="text-xs text-gray-400 ml-2">- {subProject.xp} XP</p>
                                      </div>
                                      <Input
                                        type="number"
                                        min="0"
                                        max="125"
                                        value={getProjectMark(subProject.id)} // Assurez-vous d'avoir une fonction pour obtenir la note du sous-projet
                                        onChange={(e) => {
                                          const newMark = Number(e.target.value);
                                          handleMarkChange(subProject.id, newMark); // Gérer le changement de note
                                        }}
                                        className="w-15 h-8 text-right text-sm mt-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                      />
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <p>Aucune catégorie disponible.</p> // Message ou composant à afficher si aucune catégorie n'est disponible
        )}
      </div>
    </div>
    </ProtectedRoute>
  )
}
