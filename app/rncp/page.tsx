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
  const { userInfo, fetchUserInfo } = useUserStore()
  const [updateTrigger, setUpdateTrigger] = useState(0);

  const [availableProjects, setAvailableProjects] = useState<Project[]>([
    { id: 'ft_transcendence', name: 'Ft_transcendence', xp: 24360, mark: 0, hours: 245, group: true },
    { id: '42run', name: '42run', xp: 9450, mark: 0, hours: 98, group: false },
    { id: '42sh', name: '42sh', xp: 15750, mark: 0, hours: 294, group: true },
    { id: 'abstract_data', name: 'Abstract_data', xp: 20084, mark: 0, hours: 290, group: false },
    { id: 'abstract-vm', name: 'Abstract-vm', xp: 9450, mark: 0, hours: 504, group: false },
    { id: 'avaj-launcher', name: 'Avaj-launcher', xp: 4200, mark: 0, hours: 50, group: false },
    { id: 'bgp', name: 'Bgp At Doors of Autonomous Systems', xp: 22450, mark: 0, hours: 200, group: true },
    { id: 'bomberman', name: 'Bomberman', xp: 25200, mark: 0, hours: 196, group: true },
    { id: 'boot2root', name: 'Boot2root', xp: 11500, mark: 0, hours: 49, group: true },
    { id: 'camagru', name: 'Camagru', xp: 4200, mark: 0, hours: 49, group: false },
    { id: 'cloud-1', name: 'Cloud-1', xp: 9450, mark: 0, hours: 100, group: true },
    { id: 'computorv1', name: 'Computorv1', xp: 4200, mark: 0, hours: 49, group: true },
    { id: 'computorv2', name: 'Computorv2', xp: 9450, mark: 0, hours: 147, group: true },
    { id: 'corewar', name: 'Corewar', xp: 17500, mark: 0, hours: 196, group: true },
    { id: 'cow-neck-tid', name: 'Cow-Neck-TID', xp: 30000, mark: 0, hours: 300, group: true },
    { id: 'cpp-module-00', name: 'CPP Module 00', xp: 0, mark: 0, hours: 22, group: true },
    { id: 'cpp-module-01', name: 'CPP Module 01', xp: 0, mark: 0, hours: 12, group: true },
    { id: 'cpp-module-02', name: 'CPP Module 02', xp: 0, mark: 0, hours: 12, group: true },
    { id: 'cpp-module-03', name: 'CPP Module 03', xp: 0, mark: 0, hours: 12, group: true },
    { id: 'cpp-module-04', name: 'CPP Module 04', xp: 9660, mark: 0, hours: 12, group: true },
    { id: 'cpp-module-05', name: 'CPP Module 05', xp: 0, mark: 0, hours: 25, group: true },
    { id: 'cpp-module-06', name: 'CPP Module 06', xp: 0, mark: 0, hours: 25, group: true },
    { id: 'cpp-module-07', name: 'CPP Module 07', xp: 0, mark: 0, hours: 25, group: true },
    { id: 'cpp-module-08', name: 'CPP Module 08', xp: 0, mark: 0, hours: 25, group: true },
    { id: 'cpp-module-09', name: 'CPP Module 09', xp: 10042, mark: 0, hours: 40, group: true },
    { id: 'cub3d', name: 'Cub3d', xp: 5775, mark: 0, hours: 280, group: true },
    { id: 'cybersecurity', name: 'Cybersecurity', xp: 0, mark: 0, hours: 63, group: true },
    { id: 'cybersecurity-arachnida', name: 'Cybersecurity - arachnida - Web', xp: 1350, mark: 0, hours: 7, group: true },
    { id: 'cybersecurity-ft-onion', name: 'Cybersecurity - ft_onion - Web', xp: 1350, mark: 0, hours: 7, group: true },
    { id: 'cybersecurity-ft-otp', name: 'Cybersecurity - ft_otp - OTP', xp: 1350, mark: 0, hours: 7, group: true },
    { id: 'cybersecurity-inquisitor', name: 'Cybersecurity - Inquisitor - Network', xp: 1350, mark: 0, hours: 7, group: true },
    { id: 'cybersecurity-reverse-me', name: 'Cybersecurity - Reverse me - Rev', xp: 1350, mark: 0, hours: 7, group: true },
    { id: 'cybersecurity-stockholm', name: 'Cybersecurity - Stockholm - Malware', xp: 1350, mark: 0, hours: 7, group: true },
    { id: 'cybersecurity-vaccine', name: 'Cybersecurity - Vaccine - Web', xp: 1350, mark: 0, hours: 7, group: true },
    { id: 'darkly', name: 'darkly', xp: 6300, mark: 0, hours: 98, group: true },
    { id: 'data-science-0', name: 'Data Science - 0', xp: 545, mark: 0, hours: 7, group: true },
    { id: 'data-science-1', name: 'Data Science - 1', xp: 545, mark: 0, hours: 7, group: true },
    { id: 'data-science-2', name: 'Data Science - 2', xp: 545, mark: 0, hours: 7, group: true },
    { id: 'data-science-3', name: 'Data Science - 3', xp: 545, mark: 0, hours: 7, group: true },
    { id: 'data-science-4', name: 'Data Science - 4', xp: 2545, mark: 0, hours: 7, group: true },
    { id: 'death', name: 'death', xp: 35700, mark: 0, hours: 147, group: true },
    { id: 'django-0-initiation', name: 'Django - 0 - Initiation', xp: 0, mark: 0, hours: 7, group: true },
    { id: 'django-0-oob', name: 'Django - 0 - Oob', xp: 1500, mark: 0, hours: 7, group: true },
    { id: 'django-0-starting', name: 'Django - 0 - Starting', xp: 0, mark: 0, hours: 7, group: true },
    { id: 'django-1-base', name: 'Django - 1 - Base Django', xp: 3475, mark: 0, hours: 7, group: true },
    { id: 'django-1-lib', name: 'Django - 1 - Lib', xp: 0, mark: 0, hours: 7, group: true },
    { id: 'django-2-sql', name: 'Django - 2 - SQL', xp: 1000, mark: 0, hours: 7, group: true },
    { id: 'django-3-advanced', name: 'Django - 3 - Advanced', xp: 0, mark: 0, hours: 7, group: true },
    { id: 'django-3-final', name: 'Django - 3 - Final', xp: 3475, mark: 0, hours: 7, group: true },
    { id: 'django-3-sessions', name: 'Django - 3 - Sessions', xp: 0, mark: 0, hours: 7, group: true },
    { id: 'doom-nukem', name: 'doom-nukem', xp: 15750, mark: 0, hours: 294, group: true },
    { id: 'drivers-and-interrupts', name: 'drivers-and-interrupts', xp: 15750, mark: 0, hours: 98, group: true },
    { id: 'dr-quine', name: 'dr-quine', xp: 2520, mark: 0, hours: 14, group: true },
    { id: 'dslr', name: 'dslr', xp: 6000, mark: 0, hours: 98, group: true },
    { id: 'electronics-old', name: 'Electronics-Old', xp: 0, mark: 0, hours: 0, group: true },
    { id: 'electronique', name: 'Electronique', xp: 35700, mark: 0, hours: 0, group: true },
    { id: 'expert-system', name: 'expert-system', xp: 9450, mark: 0, hours: 98, group: true },
    { id: 'famine', name: 'famine', xp: 9450, mark: 0, hours: 98, group: true },
    { id: 'fdf', name: 'FdF', xp: 1000, mark: 0, hours: 60, group: true },
    { id: 'filesystem', name: 'filesystem', xp: 15750, mark: 0, hours: 196, group: true },
    { id: 'fix-me', name: 'fix-me', xp: 15750, mark: 0, hours: 196, group: true },
    { id: 'fract-ol', name: 'fract-ol', xp: 1000, mark: 0, hours: 60, group: true },
    { id: 'fr-alternance-rncp6-1', name: 'FR - Alternance - RNCP6 - 1 an', xp: 90000, mark: 0, hours: 8760, group: true },
    { id: 'fr-alternance-rncp6-2', name: 'FR - Alternance - RNCP6 - 2 ans', xp: 150000, mark: 0, hours: 17520, group: true },
    { id: 'fr-alternance-rncp7-1', name: 'FR - Alternance - RNCP7 - 1 an', xp: 90000, mark: 0, hours: 8760, group: true },
    { id: 'fr-alternance-rncp7-2', name: 'FR - Alternance - RNCP7 - 2 ans', xp: 180000, mark: 0, hours: 17520, group: true },
    { id: 'fr-apprentissage-rncp6-1', name: 'FR Apprentissage RNCP 6 - 1 an', xp: 90000, mark: 0, hours: 8760, group: true },
    { id: 'fr-apprentissage-rncp6-2', name: 'FR Apprentissage RNCP 6 - 2 ans', xp: 150000, mark: 0, hours: 17520, group: true },
    { id: 'fr-apprentissage-rncp7-1', name: 'FR Apprentissage RNCP 7 - 1 an', xp: 90000, mark: 0, hours: 8760, group: true },
    { id: 'fr-apprentissage-rncp7-2', name: 'FR Apprentissage RNCP 7 - 2 ans', xp: 180000, mark: 0, hours: 17520, group: true },
    { id: 'freddie-mercury', name: 'freddie-mercury', xp: 12600, mark: 0, hours: 360, group: true },
    { id: 'ft_ality', name: 'ft_ality', xp: 4200, mark: 0, hours: 98, group: true },
    { id: 'ft_containers', name: 'ft_containers', xp: 10042, mark: 0, hours: 140, group: true },
    { id: 'ft_hangouts', name: 'ft_hangouts', xp: 4200, mark: 0, hours: 49, group: true },
    { id: 'ft_irc', name: 'ft_irc', xp: 21630, mark: 0, hours: 175, group: true },
    { id: 'ft_kalman', name: 'ft_kalman', xp: 16800, mark: 0, hours: 210, group: true },
    { id: 'ft_linear_regression', name: 'ft_linear_regression', xp: 4200, mark: 0, hours: 70, group: true },
    { id: 'ft_linux', name: 'ft_linux', xp: 4200, mark: 0, hours: 49, group: true },
    { id: 'ftl_quantum', name: 'Ftl_quantum', xp: 6500, mark: 0, hours: 98, group: true },
    { id: 'ft_ls', name: 'ft_ls', xp: 4200, mark: 0, hours: 49, group: true },
    { id: 'ft_malcolm', name: 'ft_malcolm', xp: 6000, mark: 0, hours: 49, group: true },
    { id: 'ft_minecraft', name: 'ft_minecraft', xp: 20750, mark: 0, hours: 560, group: true },
    { id: 'ft_newton', name: 'ft_newton', xp: 24360, mark: 0, hours: 98, group: true },
    { id: 'ft_nmap', name: 'ft_nmap', xp: 15750, mark: 0, hours: 49, group: true },
    { id: 'ft_ping', name: 'ft_ping', xp: 4200, mark: 0, hours: 49, group: true },
    { id: 'ft_printf', name: 'ft_printf', xp: 882, mark: 0, hours: 70, group: true },
    { id: 'ft_script', name: 'ft_script', xp: 4200, mark: 0, hours: 168, group: true },
    { id: 'ft_select', name: 'ft_select', xp: 4200, mark: 0, hours: 168, group: true },
    { id: 'ft_server', name: 'ft_server', xp: 1722, mark: 0, hours: 84, group: true },
    { id: 'ft_services', name: 'ft_services', xp: 10042, mark: 0, hours: 210, group: true },
    { id: 'ft_shield', name: 'ft_shield', xp: 15750, mark: 0, hours: 196, group: true },
    { id: 'ft_ssl_des', name: 'ft_ssl_des', xp: 9450, mark: 0, hours: 49, group: true },
    { id: 'ft_ssl_md5', name: 'ft_ssl_md5', xp: 9450, mark: 0, hours: 49, group: true },
    { id: 'ft_ssl_rsa', name: 'ft_ssl_rsa', xp: 15750, mark: 0, hours: 49, group: true },
    { id: 'ft_traceroute', name: 'ft_traceroute', xp: 4200, mark: 0, hours: 49, group: true },
    { id: 'ft_turing', name: 'ft_turing', xp: 9450, mark: 0, hours: 98, group: true },
    { id: 'ft_vox', name: 'ft_vox', xp: 15750, mark: 0, hours: 147, group: true },
    { id: 'gbmu', name: 'gbmu', xp: 31500, mark: 0, hours: 420, group: true },
    { id: 'get_next_line', name: 'get_next_line', xp: 882, mark: 0, hours: 70, group: true },
    { id: 'gomoku', name: 'gomoku', xp: 25200, mark: 0, hours: 196, group: true },
    { id: 'guimp', name: 'guimp', xp: 12600, mark: 0, hours: 147, group: true },
    { id: 'h42n42', name: 'h42n42', xp: 9450, mark: 0, hours: 98, group: true },
    { id: 'humangl', name: 'humangl', xp: 4200, mark: 0, hours: 49, group: true },
    { id: 'hypertube', name: 'hypertube', xp: 15750, mark: 0, hours: 196, group: true },
    { id: 'inception', name: 'Inception', xp: 10042, mark: 0, hours: 210, group: true },
    { id: 'inception-of-things', name: 'Inception-of-Things', xp: 25450, mark: 0, hours: 200, group: true },
    { id: 'internship-1', name: 'Internship I', xp: 42000, mark: 0, hours: 2880, group: true },
    { id: 'internship-2', name: 'Internship II', xp: 63000, mark: 0, hours: 2880, group: true },
    { id: 'in-the-shadows', name: 'in-the-shadows', xp: 9450, mark: 0, hours: 147, group: true },
    { id: 'kfs-1', name: 'kfs-1', xp: 15750, mark: 0, hours: 294, group: true },
    { id: 'kfs-2', name: 'kfs-2', xp: 15750, mark: 0, hours: 294, group: true },
    { id: 'kfs-3', name: 'kfs-3', xp: 35700, mark: 0, hours: 294, group: true },
    { id: 'kfs-4', name: 'kfs-4', xp: 25200, mark: 0, hours: 196, group: true },
    { id: 'kfs-5', name: 'kfs-5', xp: 35700, mark: 0, hours: 392, group: true },
    { id: 'kfs-6', name: 'kfs-6', xp: 25200, mark: 0, hours: 294, group: true },
    { id: 'kfs-7', name: 'kfs-7', xp: 35700, mark: 0, hours: 630, group: true },
    { id: 'kfs-8', name: 'kfs-8', xp: 15750, mark: 0, hours: 196, group: true },
    { id: 'kfs-9', name: 'kfs-9', xp: 15750, mark: 0, hours: 245, group: true },
    { id: 'kfs-x', name: 'kfs-x', xp: 35700, mark: 0, hours: 56, group: true },
    { id: 'krpsim', name: 'krpsim', xp: 9450, mark: 0, hours: 49, group: true },
    { id: 'leaffliction', name: 'Leaffliction', xp: 15750, mark: 0, hours: 294, group: true },
    { id: 'learn2slither', name: 'Learn2Slither', xp: 9450, mark: 0, hours: 98, group: true },
    { id: 'lem_in', name: 'lem_in', xp: 9450, mark: 0, hours: 98, group: true },
    { id: 'lem-ipc', name: 'lem-ipc', xp: 9450, mark: 0, hours: 98, group: true },
    { id: 'libasm', name: 'libasm', xp: 966, mark: 0, hours: 20, group: true },
    { id: 'libft', name: 'Libft', xp: 462, mark: 0, hours: 70, group: false },
    { id: 'libftpp', name: 'libftpp', xp: 5880, mark: 0, hours: 98, group: true },
    { id: 'little-penguin-1', name: 'little-penguin-1', xp: 9450, mark: 0, hours: 100, group: true },
    { id: 'malloc', name: 'malloc', xp: 9450, mark: 0, hours: 49, group: true },
    { id: 'matcha', name: 'matcha', xp: 9450, mark: 0, hours: 98, group: true },
    { id: 'matrix', name: 'matrix', xp: 7000, mark: 0, hours: 110, group: true },
    { id: 'matt-daemon', name: 'matt-daemon', xp: 9450, mark: 0, hours: 49, group: true },
    { id: 'minirt', name: 'miniRT', xp: 5775, mark: 0, hours: 280, group: true },
    { id: 'minishell', name: 'minishell', xp: 2814, mark: 0, hours: 210, group: true },
    { id: 'minitalk', name: 'minitalk', xp: 1142, mark: 0, hours: 50, group: true },
    { id: 'mobile', name: 'Mobile', xp: 0, mark: 0, hours: 63, group: true },
    { id: 'mobile-0-basic', name: 'Mobile - 0 - Basic of the mobile application', xp: 500, mark: 0, hours: 7, group: true },
    { id: 'mobile-1-structure', name: 'Mobile - 1 - Structure and logic', xp: 950, mark: 0, hours: 7, group: true },
    { id: 'mobile-2-api', name: 'Mobile - 2 - API and data', xp: 1000, mark: 0, hours: 7, group: true },
    { id: 'mobile-3-design', name: 'Mobile - 3 - Design', xp: 2000, mark: 0, hours: 7, group: true },
    { id: 'mobile-4-auth', name: 'Mobile - 4 - Auth and dataBase', xp: 2000, mark: 0, hours: 7, group: true },
    { id: 'mobile-5-manage', name: 'Mobile - 5 - Manage data and display', xp: 3000, mark: 0, hours: 7, group: true },
    { id: 'mod1', name: 'mod1', xp: 9450, mark: 0, hours: 98, group: true },
    { id: 'multilayer-perceptron', name: 'multilayer-perceptron', xp: 9450, mark: 0, hours: 98, group: true },
    { id: 'music-room', name: 'music-room', xp: 25200, mark: 0, hours: 196, group: true },
    { id: 'netpractice', name: 'NetPractice', xp: 3160, mark: 0, hours: 50, group: true },
    { id: 'nibbler', name: 'nibbler', xp: 9450, mark: 0, hours: 98, group: true },
    { id: 'nm', name: 'nm', xp: 9450, mark: 0, hours: 360, group: true },
    { id: 'n-puzzle', name: 'n-puzzle', xp: 9450, mark: 0, hours: 98, group: true },
    { id: 'ocaml-basic-syntax-0', name: 'OCAML - Basic syntax and semantics - 0', xp: 0, mark: 0, hours: 7, group: true },
    { id: 'ocaml-functor-1', name: 'OCAML - Functor - 1', xp: 2250, mark: 0, hours: 7, group: true },
    { id: 'ocaml-imperative-1', name: 'OCAML - Imperative features - 1', xp: 0, mark: 0, hours: 7, group: true },
    { id: 'ocaml-monoids-monads-3', name: 'OCAML - Monoids and Monads - 3', xp: 3475, mark: 0, hours: 7, group: true },
    { id: 'ocaml-oop-1', name: 'OCAML - Object Oriented Programming - 1', xp: 0, mark: 0, hours: 7, group: true },
    { id: 'ocaml-oop-2', name: 'OCAML - Object Oriented Programming - 2', xp: 2225, mark: 0, hours: 7, group: true },
    { id: 'ocaml-modules-1', name: 'OCAML - OCaml\'s modules language - 1', xp: 0, mark: 0, hours: 7, group: true },
    { id: 'ocaml-pattern-matching-0', name: 'OCAML - Pattern Matching and Data Types - 0', xp: 1500, mark: 0, hours: 7, group: true },
    { id: 'ocaml-recursion-0', name: 'OCAML - Recursion and higher-order functions - 0', xp: 0, mark: 0, hours: 7, group: true },
    { id: 'old-irc', name: 'Old-IRC', xp: 21630, mark: 0, hours: 175, group: true },
    { id: 'old-philosophers', name: 'Old-Philosophers', xp: 3360, mark: 0, hours: 70, group: true },
    { id: 'open-project', name: 'Open Project', xp: 31500, mark: 0, hours: 1440, group: true },
    { id: 'cybersecurity-iron-dome', name: '(Optional) Cybersecurity - Iron Dome - Malware', xp: 0, mark: 0, hours: 7, group: true },
    { id: 'override', name: 'override', xp: 35700, mark: 0, hours: 196, group: true },
    { id: 'particle-system', name: 'particle-system', xp: 15750, mark: 0, hours: 147, group: true },
    { id: 'part-time-1', name: 'Part_Time I', xp: 42000, mark: 0, hours: 2880, group: true },
    { id: 'part-time-2', name: 'Part_Time II', xp: 63000, mark: 0, hours: 2880, group: true },
    { id: 'peace-break', name: 'Peace_Break', xp: 9000, mark: 0, hours: 98, group: true },
    { id: 'pestilence', name: 'pestilence', xp: 15750, mark: 0, hours: 196, group: true },
    { id: 'philosophers', name: 'Philosophers', xp: 3360, mark: 0, hours: 70, group: true },
    { id: 'pipex', name: 'pipex', xp: 1142, mark: 0, hours: 50, group: true },
    { id: 'piscine-data-science', name: 'Piscine Data Science', xp: 0, mark: 0, hours: 35, group: true },
    { id: 'piscine-django', name: 'Piscine Django', xp: 0, mark: 0, hours: 63, group: true },
    { id: 'piscine-object', name: 'Piscine Object', xp: 0, mark: 0, hours: 64, group: true },
    { id: 'piscine-object-00', name: 'Piscine Object - Module 00 - Encapsulation', xp: 945, mark: 0, hours: 7, group: true },
    { id: 'piscine-object-01', name: 'Piscine Object - Module 01 - Relationship', xp: 945, mark: 0, hours: 7, group: true },
    { id: 'piscine-object-02', name: 'Piscine Object - Module 02 - UML', xp: 1890, mark: 0, hours: 7, group: true },
    { id: 'piscine-object-03', name: 'Piscine Object - Module 03 - SOLID', xp: 1890, mark: 0, hours: 7, group: true },
    { id: 'piscine-object-04', name: 'Piscine Object - Module 04 - Design Pattern', xp: 1890, mark: 0, hours: 7, group: true },
    { id: 'piscine-object-05', name: 'Piscine Object - Module 05 - Practical work', xp: 1890, mark: 0, hours: 14, group: true },
    { id: 'piscine-ocaml', name: 'Piscine ocaml', xp: 0, mark: 0, hours: 63, group: true },
    { id: 'piscine-php-symfony', name: 'Piscine PHP Symfony', xp: 9450, mark: 0, hours: 1440, group: true },
    { id: 'piscine-ror', name: 'Piscine RoR', xp: 0, mark: 0, hours: 63, group: true },
    { id: 'piscine-ruby-on-rails', name: 'Piscine Ruby on Rails', xp: 9450, mark: 0, hours: 1440, group: true },
    { id: 'piscine-symfony', name: 'Piscine Symfony', xp: 0, mark: 0, hours: 63, group: true },
    { id: 'process-and-memory', name: 'process-and-memory', xp: 9450, mark: 0, hours: 98, group: true },
    { id: 'push_swap', name: 'push_swap', xp: 1855, mark: 0, hours: 60, group: true },
    { id: 'python-0-starting', name: 'Python - 0 - Starting', xp: 545, mark: 0, hours: 7, group: true },
    { id: 'python-1-array', name: 'Python - 1 - Array', xp: 545, mark: 0, hours: 7, group: true },
    { id: 'python-2-datatable', name: 'Python - 2 - DataTable', xp: 545, mark: 0, hours: 7, group: true },
    { id: 'python-3-oop', name: 'Python - 3 - OOP', xp: 545, mark: 0, hours: 7, group: true },
    { id: 'python-4-dod', name: 'Python - 4 - Dod', xp: 2545, mark: 0, hours: 7, group: true },
    { id: 'python-for-data-science', name: 'Python for Data Science', xp: 0, mark: 0, hours: 35, group: true },
    { id: 'rainfall', name: 'rainfall', xp: 25200, mark: 0, hours: 672, group: true },
    { id: 'ready-set-boole', name: 'ready set boole', xp: 7000, mark: 0, hours: 110, group: true },
    { id: 'red-tetris', name: 'red-tetris', xp: 15750, mark: 0, hours: 147, group: true },
    { id: 'ror-0-initiation', name: 'RoR - 0 - Initiation', xp: 0, mark: 0, hours: 7, group: true },
    { id: 'ror-0-oob', name: 'RoR - 0 - Oob', xp: 1500, mark: 0, hours: 7, group: true },
    { id: 'ror-0-starting', name: 'RoR - 0 - Starting', xp: 0, mark: 0, hours: 7, group: true },
    { id: 'ror-1-base-rails', name: 'RoR - 1 - Base Rails', xp: 3475, mark: 0, hours: 7, group: true },
    { id: 'ror-1-gems', name: 'RoR - 1 - Gems', xp: 0, mark: 0, hours: 7, group: true },
    { id: 'ror-2-sql', name: 'RoR - 2 - SQL', xp: 1000, mark: 0, hours: 7, group: true },
    { id: 'ror-3-advanced', name: 'RoR - 3 - Advanced', xp: 0, mark: 0, hours: 7, group: true },
    { id: 'ror-3-final', name: 'RoR - 3 - Final', xp: 3475, mark: 0, hours: 7, group: true },
    { id: 'ror-3-sessions', name: 'RoR - 3 - Sessions', xp: 0, mark: 0, hours: 7, group: true },
    { id: 'rt', name: 'rt', xp: 20750, mark: 0, hours: 294, group: true },
    { id: 'rubik', name: 'rubik', xp: 9450, mark: 0, hours: 98, group: true },
    { id: 'rushes', name: 'Rushes', xp: 0, mark: 0, hours: 2, group: true },
    { id: 'scop', name: 'scop', xp: 9450, mark: 0, hours: 49, group: true },
    { id: 'shaderpixel', name: 'shaderpixel', xp: 15750, mark: 0, hours: 147, group: true },
    { id: 'snow-crash', name: 'snow-crash', xp: 9450, mark: 0, hours: 147, group: true },
    { id: 'so_long', name: 'so_long', xp: 1000, mark: 0, hours: 60, group: true },
    { id: 'startup-internship', name: 'Startup Internship', xp: 42000, mark: 0, hours: 2880, group: true },
    { id: 'strace', name: 'strace', xp: 9450, mark: 0, hours: 49, group: true },
    { id: 'swifty-companion', name: 'swifty-companion', xp: 4200, mark: 0, hours: 49, group: true },
    { id: 'swifty-proteins', name: 'swifty-proteins', xp: 15750, mark: 0, hours: 147, group: true },
    { id: 'swingy', name: 'swingy', xp: 9450, mark: 0, hours: 98, group: true },
    { id: 'symfony-0-initiation', name: 'Symfony - 0 - Initiation', xp: 0, mark: 0, hours: 7, group: true },
    { id: 'symfony-0-oob', name: 'Symfony - 0 - Oob', xp: 1500, mark: 0, hours: 7, group: true },
    { id: 'symfony-0-starting', name: 'Symfony - 0 - Starting', xp: 0, mark: 0, hours: 7, group: true },
    { id: 'symfony-1-base', name: 'Symfony - 1 - Base Symfony', xp: 3475, mark: 0, hours: 7, group: true },
    { id: 'symfony-1-composer', name: 'Symfony - 1 - Composer', xp: 0, mark: 0, hours: 7, group: true },
    { id: 'symfony-2-sql', name: 'Symfony - 2 - SQL', xp: 1000, mark: 0, hours: 7, group: true },
    { id: 'symfony-3-advanced', name: 'Symfony - 3 - Advanced', xp: 0, mark: 0, hours: 7, group: true },
    { id: 'symfony-3-final', name: 'Symfony - 3 - Final', xp: 3475, mark: 0, hours: 7, group: true },
    { id: 'symfony-3-sessions', name: 'Symfony - 3 - Sessions', xp: 0, mark: 0, hours: 7, group: true },
    { id: 'taskmaster', name: 'taskmaster', xp: 9450, mark: 0, hours: 98, group: true },
    { id: 'tinky-winkey', name: 'tinky-winkey', xp: 16800, mark: 0, hours: 210, group: true },
    { id: 'tokenize-art', name: 'TokenizeArt', xp: 9450, mark: 0, hours: 98, group: true },
    { id: 'tokenizer', name: 'Tokenizer', xp: 9450, mark: 0, hours: 98, group: true },
    { id: 'total-perspective-vortex', name: 'total-perspective-vortex', xp: 9450, mark: 0, hours: 98, group: true },
    { id: 'unity', name: 'Unity', xp: 0, mark: 0, hours: 49, group: true },
    { id: 'unity-0-basics', name: 'Unity - 0 - The basics Unity tools', xp: 500, mark: 0, hours: 7, group: true },
    { id: 'unity-1-physics', name: 'Unity - 1 - 3D physics, Tags, Layers and Scene', xp: 500, mark: 0, hours: 7, group: true },
    { id: 'unity-2-2d', name: 'Unity - 2 - 2D environment, tiles and sprites', xp: 1000, mark: 0, hours: 7, group: true },
    { id: 'unity-3-inputs', name: 'Unity - 3 - Advanced inputs and 2D GUI', xp: 1000, mark: 0, hours: 7, group: true },
    { id: 'unity-4-animations', name: 'Unity - 4 - Animations and Sound', xp: 1000, mark: 0, hours: 7, group: true },
    { id: 'unity-5-singleton', name: 'Unity - 5 - Singleton, playerPrefs and coroutines', xp: 2000, mark: 0, hours: 7, group: true },
    { id: 'unity-6-navmesh', name: 'Unity - 6 - Navmesh, light, sound and camera', xp: 3450, mark: 0, hours: 7, group: true },
    { id: 'unleash-the-box', name: 'UnleashTheBox', xp: 15750, mark: 0, hours: 147, group: true },
    { id: 'userspace-digressions', name: 'userspace_digressions', xp: 16800, mark: 0, hours: 294, group: true },
    { id: 'very-real-engine', name: 'Very_Real_Engine', xp: 30000, mark: 0, hours: 600, group: true },
    { id: 'war', name: 'war', xp: 35700, mark: 0, hours: 196, group: true },
    { id: 'webserv', name: 'webserv', xp: 21630, mark: 0, hours: 175, group: true },
    { id: 'woody-woodpacker', name: 'woody-woodpacker', xp: 9450, mark: 0, hours: 49, group: true },
    { id: 'xv', name: 'xv', xp: 22000, mark: 0, hours: 392, group: true },
    { id: 'zappy', name: 'zappy', xp: 25200, mark: 0, hours: 294, group: true }
  ])

  useEffect(() => {
    const initializeUserData = async () => {
      if (!localStorage.getItem('accessToken')) {
        router.push('/')
        return
      }

      try {
        if (!userInfo) {
          await fetchUserInfo()
        }
      } catch (error) {
        console.error('Erreur:', error)
        router.push('/')
      }
    }

    initializeUserData()
  }, [router, fetchUserInfo])

  // Effet séparé pour mettre à jour les états quand userInfo change
  useEffect(() => {
    if (userInfo) {
      // Définir le level
      setUserLevel(userInfo.cursus_users?.find((cursus: any) => 
        cursus.cursus_id === 21
      )?.level || 0)

      // Récupérer les projets depuis userInfo
      if (userInfo.projects_users) {
        setUserProjects(userInfo.projects_users)

        // Compter les projets de groupe validés
        const validatedProjects = userInfo.projects_users.filter((project: any) => 
          project.status === "finished" && 
          project["validated?"] === true
        );

        // Trouver les projets correspondants dans availableProjects
        const groupProjectsCount = validatedProjects.reduce((count, userProject) => {
          const projectInList = availableProjects.find(p => {
            const normalizedUserSlug = userProject.project.slug.toLowerCase()
              .replace('42cursus-', '')
              .replace(/[-_]/g, '');
            const normalizedListSlug = p.id.toLowerCase()
              .replace(/[-_]/g, '');
            return normalizedUserSlug === normalizedListSlug;
          });

          // Incrémenter le compteur si c'est un projet de groupe
          return projectInList?.group ? count + 1 : count;
        }, 0);

        setGroupProjects(groupProjectsCount);
      }

      // Compter les événements pédagogiques
      if (userInfo.events) {
        const pedagogicalEventsCount = userInfo.events.filter((event: any) => 
          event.event_type === "conference" || 
          event.event_type === "workshop" || 
          event.event_type === "hackathon" ||
          event.event_type === "extern" ||
          event.event_type === "association"
        ).length
        setPedagogicalEvents(pedagogicalEventsCount)
      }

      // Liste des slugs valides pour les expériences professionnelles
      const validProfessionalSlugs = [
        '42cursus-startup-internship',
        'internship-ii',
        'internship-i',
        'apprentissage-1-an',
        '42cursus-apprentissage-2-ans-1ere-annee',
        'apprentissage-2-ans-2eme-annee',
      ];

      // Compter les expériences professionnelles
      if (userInfo.projects_users) {
        const professionalProjectsCount = userInfo.projects_users.filter((project: any) => {
          const projectSlug = project.project.slug.toLowerCase();
          return validProfessionalSlugs.includes(projectSlug) &&
                 project.status === "finished" &&
                 project["validated?"] === true;
        }).length;

        // Ajouter les internships s'ils existent
        const internshipsCount = userInfo.internships?.length || 0;

        setProfessionalExperiences(professionalProjectsCount + internshipsCount);
      }

      // Debug pour voir la structure des données
      console.log('userInfo structure:', {
        cursus_users: userInfo.cursus_users,
        projects_users: userInfo.projects_users,
        events: userInfo.events,
        internships: userInfo.internships
      });
    }
  }, [userInfo, availableProjects]);

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
      options: {
        
        web: {
          name: 'Développement web et mobile',
          categories: {
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
              },
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
              },
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
      options: {
        sys: {
          name: 'Système d\'information et réseaux',
          categories: {
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
              },
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
              },
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
    // Forcer un re-rendu
    setUpdateTrigger(prev => prev + 1);
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
      const mark = getProjectMark(project.id);
      if (mark >= 75) { // Projet validé si note >= 75
        let xp = project.xp;
        // Bonus si note > 100
        if (mark > 100) {
          const bonusPercentage = (mark - 100) / 100;
          xp += project.xp * bonusPercentage;
        }
        return total + xp;
      }
      return total;
    }, 0);
  };

  const getProjectMark = (projectId: string): number => {
    // Vérifier d'abord s'il y a une note simulée
    if (simulatedMarks[projectId] !== undefined) {
      return simulatedMarks[projectId];
    }

    // Sinon chercher la note réelle du projet
    const project = userProjects.find(p => {
      const projectSlug = p.project.slug.toLowerCase();
      const searchSlug = projectId.toLowerCase();
      return projectSlug === searchSlug ||
             projectSlug === `42cursus-${searchSlug}` ||
             projectSlug.replace('42cursus-', '') === searchSlug ||
             projectSlug.replace(/[-_]/g, '') === searchSlug.replace(/[-_]/g, '') ||
             projectSlug.replace('42cursus-', '').replace(/[-_]/g, '') === searchSlug.replace(/[-_]/g, '');
    });

    return project?.final_mark || 0;
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8 space-y-4 md:space-y-8">
      <h1 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-300 to-gray-500">
        Titres RNCP
      </h1>

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
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:flex xl:flex-row gap-4">
        {Object.entries(titles).flatMap(([titleId, title]) =>
          Object.entries(title.options).map(([optionId, option]) => (
            <Button
              key={`${titleId}-${optionId}`}
              onClick={() => setActiveOption(optionId)}
              variant={activeOption === optionId ? "secondary" : "default"}
              className={`w-full xl:flex-1 ${
                activeOption === optionId 
                  ? "bg-white text-black hover:bg-gray-200" 
                  : "bg-transparent text-white border border-white/10 hover:bg-white/10"
              }`}
            >
              {option.name}
            </Button>
          ))
        )}
      </div>

      {/* Catégories de projets */}
      <div className={`grid gap-4 ${
        Object.keys(activeData.option.categories).length === 2 
          ? 'grid-cols-1 sm:grid-cols-2' :
        Object.keys(activeData.option.categories).length === 3 
          ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' :
        'grid-cols-1 sm:grid-cols-2 xl:grid-cols-4'
      }`}>
        {/* Pour chaque catégorie */}
        {Object.entries(activeData.option.categories).map(([catId, category]) => (
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
                {category.projects.map(project => (
                  <Card key={project.id} className={`border-white/10 ${
                    isProjectCompleted(project.id) ? 'bg-emerald-900/20' : 'bg-zinc-900/50'
                  }`}>
                    <CardContent className="p-4">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <div className="w-full sm:w-auto">
                          <p className="text-sm font-medium text-white">{project.name}</p>
                          <p className="text-xs text-gray-400">{project.xp} XP</p>
                        </div>
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          <Input
                            type="number"
                            min="0"
                            max="125"
                            value={getProjectMark(project.id)}
                            onChange={(e) => handleMarkChange(project.id, Number(e.target.value))}
                            className="w-full sm:w-20 h-8 text-right text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
