import { useState, useEffect, useRef } from 'react'
import { Plus, Trash2, Loader2, RefreshCw } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useLanguage } from '../context/LanguageContext'

const STATUS_OPTIONS = [
  { value: 'backlog', label: 'Backlog', color: 'bg-gray-100 text-gray-700' },
  { value: 'in_progress', label: 'In Progress', color: 'bg-blue-100 text-blue-700' },
  { value: 'completed', label: 'Completed', color: 'bg-green-100 text-green-700' },
  { value: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-700' },
]

const TEAM_OPTIONS = [
  'Studio RnD / Product',
  'Growth RnD / Product',
  'PnP',
  'PMM / Corp',
  'GTM',
]

function EditableCell({ value, onChange, type = 'text', options = [], placeholder = '' }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(value || '')
  const inputRef = useRef(null)

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      if (type === 'text' || type === 'number') {
        inputRef.current.select()
      }
    }
  }, [isEditing, type])

  useEffect(() => {
    setEditValue(value || '')
  }, [value])

  const handleSave = () => {
    setIsEditing(false)
    if (editValue !== value) {
      onChange(type === 'number' ? (editValue ? parseFloat(editValue) : null) : editValue)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSave()
    } else if (e.key === 'Escape') {
      setEditValue(value || '')
      setIsEditing(false)
    }
  }

  if (isEditing) {
    if (type === 'select') {
      return (
        <select
          ref={inputRef}
          value={editValue}
          onChange={(e) => {
            setEditValue(e.target.value)
            onChange(e.target.value)
            setIsEditing(false)
          }}
          onBlur={() => setIsEditing(false)}
          className="w-full px-2 py-1 text-sm border border-sw-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-sw-blue-500"
        >
          <option value="">{placeholder || 'Select...'}</option>
          {options.map(opt => (
            <option key={typeof opt === 'string' ? opt : opt.value} value={typeof opt === 'string' ? opt : opt.value}>
              {typeof opt === 'string' ? opt : opt.label}
            </option>
          ))}
        </select>
      )
    }

    return (
      <input
        ref={inputRef}
        type={type}
        step={type === 'number' ? '0.5' : undefined}
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        className="w-full px-2 py-1 text-sm border border-sw-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-sw-blue-500"
        placeholder={placeholder}
      />
    )
  }

  const displayValue = type === 'select' && options.length > 0
    ? options.find(o => (typeof o === 'string' ? o : o.value) === value)?.label || value
    : value

  return (
    <div
      onClick={() => setIsEditing(true)}
      className="cursor-pointer px-2 py-1 -mx-2 -my-1 rounded hover:bg-sw-blue-50 min-h-[28px] transition-colors"
    >
      {displayValue || <span className="text-sw-gray-400 italic">{placeholder || 'Click to edit'}</span>}
    </div>
  )
}

function StatusBadge({ value, onChange }) {
  const [isEditing, setIsEditing] = useState(false)
  const selectRef = useRef(null)

  useEffect(() => {
    if (isEditing && selectRef.current) {
      selectRef.current.focus()
    }
  }, [isEditing])

  const currentStatus = STATUS_OPTIONS.find(s => s.value === value) || STATUS_OPTIONS[0]

  if (isEditing) {
    return (
      <select
        ref={selectRef}
        value={value || 'backlog'}
        onChange={(e) => {
          onChange(e.target.value)
          setIsEditing(false)
        }}
        onBlur={() => setIsEditing(false)}
        className="px-2 py-1 text-xs font-medium border border-sw-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-sw-blue-500"
      >
        {STATUS_OPTIONS.map(status => (
          <option key={status.value} value={status.value}>{status.label}</option>
        ))}
      </select>
    )
  }

  return (
    <span
      onClick={() => setIsEditing(true)}
      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full cursor-pointer hover:opacity-80 transition-opacity ${currentStatus.color}`}
    >
      {currentStatus.label}
    </span>
  )
}

export default function ProjectTracker() {
  const { t } = useLanguage()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newProject, setNewProject] = useState({
    item: '',
    description: '',
    estimated_weeks: '',
    delivered_by: '',
    project_status: 'backlog',
    owners: '',
  })

  useEffect(() => {
    fetchProjects()
  }, [])

  async function fetchProjects() {
    setLoading(true)
    setError(null)
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')

      if (error) throw error
      setProjects(data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function addProject() {
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert([{
          item: newProject.item,
          description: newProject.description,
          estimated_weeks: newProject.estimated_weeks ? parseFloat(newProject.estimated_weeks) : null,
          delivered_by: newProject.delivered_by,
          project_status: newProject.project_status,
          owners: newProject.owners,
        }])
        .select()

      if (error) throw error
      setProjects([data[0], ...projects])
      setNewProject({
        item: '',
        description: '',
        estimated_weeks: '',
        delivered_by: '',
        project_status: 'backlog',
        owners: '',
      })
      setShowAddForm(false)
    } catch (err) {
      alert('Error adding project: ' + err.message)
    }
  }

  async function updateCell(id, field, value) {
    try {
      const { error } = await supabase
        .from('projects')
        .update({ [field]: value })
        .eq('id', id)

      if (error) throw error
      setProjects(projects.map(p => p.id === id ? { ...p, [field]: value } : p))
    } catch (err) {
      alert('Error updating: ' + err.message)
    }
  }

  async function deleteProject(id) {
    if (!confirm('Are you sure you want to delete this project?')) return
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id)

      if (error) throw error
      setProjects(projects.filter(p => p.id !== id))
    } catch (err) {
      alert('Error deleting project: ' + err.message)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-sw-blue-600" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-red-600">{t('projects.error')}: {error}</p>
        <button
          onClick={fetchProjects}
          className="flex items-center gap-2 px-4 py-2 bg-sw-blue-600 text-white rounded-lg hover:bg-sw-blue-700"
        >
          <RefreshCw className="w-4 h-4" />
          {t('projects.retry')}
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-sw-dark">{t('projects.title')}</h1>
          <p className="text-sw-gray-500 mt-1">{t('projects.subtitle')}</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchProjects}
            className="flex items-center gap-2 px-3 py-2 text-sw-gray-600 hover:bg-sw-gray-100 rounded-lg"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-sw-blue-600 text-white rounded-lg hover:bg-sw-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            {t('projects.addProject')}
          </button>
        </div>
      </div>

      {showAddForm && (
        <div className="bg-white rounded-xl border border-sw-gray-200 p-6 mb-6">
          <h3 className="text-lg font-semibold text-sw-dark mb-4">{t('projects.newProject')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-sw-gray-700 mb-1">{t('projects.item')}</label>
              <input
                type="text"
                value={newProject.item}
                onChange={(e) => setNewProject({ ...newProject, item: e.target.value })}
                className="w-full px-3 py-2 border border-sw-gray-300 rounded-lg focus:ring-2 focus:ring-sw-blue-500 focus:border-sw-blue-500"
                placeholder={t('projects.itemPlaceholder')}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-sw-gray-700 mb-1">{t('projects.description')}</label>
              <input
                type="text"
                value={newProject.description}
                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                className="w-full px-3 py-2 border border-sw-gray-300 rounded-lg focus:ring-2 focus:ring-sw-blue-500 focus:border-sw-blue-500"
                placeholder={t('projects.descriptionPlaceholder')}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-sw-gray-700 mb-1">{t('projects.estimatedWeeks')}</label>
              <input
                type="number"
                step="0.5"
                value={newProject.estimated_weeks}
                onChange={(e) => setNewProject({ ...newProject, estimated_weeks: e.target.value })}
                className="w-full px-3 py-2 border border-sw-gray-300 rounded-lg focus:ring-2 focus:ring-sw-blue-500 focus:border-sw-blue-500"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-sw-gray-700 mb-1">{t('projects.deliveredBy')}</label>
              <input
                type="text"
                value={newProject.delivered_by}
                onChange={(e) => setNewProject({ ...newProject, delivered_by: e.target.value })}
                className="w-full px-3 py-2 border border-sw-gray-300 rounded-lg focus:ring-2 focus:ring-sw-blue-500 focus:border-sw-blue-500"
                placeholder={t('projects.deliveredByPlaceholder')}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-sw-gray-700 mb-1">{t('projects.status')}</label>
              <select
                value={newProject.project_status}
                onChange={(e) => setNewProject({ ...newProject, project_status: e.target.value })}
                className="w-full px-3 py-2 border border-sw-gray-300 rounded-lg focus:ring-2 focus:ring-sw-blue-500 focus:border-sw-blue-500"
              >
                {STATUS_OPTIONS.map(status => (
                  <option key={status.value} value={status.value}>{status.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-sw-gray-700 mb-1">{t('projects.owners')}</label>
              <select
                value={newProject.owners}
                onChange={(e) => setNewProject({ ...newProject, owners: e.target.value })}
                className="w-full px-3 py-2 border border-sw-gray-300 rounded-lg focus:ring-2 focus:ring-sw-blue-500 focus:border-sw-blue-500"
              >
                <option value="">{t('projects.selectTeam')}</option>
                {TEAM_OPTIONS.map(team => (
                  <option key={team} value={team}>{team}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <button
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 text-sw-gray-600 hover:bg-sw-gray-100 rounded-lg"
            >
              {t('projects.cancel')}
            </button>
            <button
              onClick={addProject}
              disabled={!newProject.item}
              className="px-4 py-2 bg-sw-blue-600 text-white rounded-lg hover:bg-sw-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t('projects.add')}
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-sw-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-sw-gray-50 border-b border-sw-gray-200">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-semibold text-sw-gray-700">{t('projects.item')}</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-sw-gray-700">{t('projects.description')}</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-sw-gray-700">{t('projects.estimatedWeeks')}</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-sw-gray-700">{t('projects.deliveredBy')}</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-sw-gray-700">{t('projects.status')}</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-sw-gray-700">{t('projects.owners')}</th>
                <th className="text-right px-4 py-3 text-sm font-semibold text-sw-gray-700 w-16"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sw-gray-200">
              {projects.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-4 py-8 text-center text-sw-gray-500">
                    {t('projects.noProjects')}
                  </td>
                </tr>
              ) : (
                projects.map((project) => (
                  <tr key={project.id} className="hover:bg-sw-gray-50">
                    <td className="px-4 py-3 text-sm text-sw-dark font-medium">
                      <EditableCell
                        value={project.item}
                        onChange={(val) => updateCell(project.id, 'item', val)}
                        placeholder={t('projects.itemPlaceholder')}
                      />
                    </td>
                    <td className="px-4 py-3 text-sm text-sw-gray-600 max-w-xs">
                      <EditableCell
                        value={project.description}
                        onChange={(val) => updateCell(project.id, 'description', val)}
                        placeholder={t('projects.descriptionPlaceholder')}
                      />
                    </td>
                    <td className="px-4 py-3 text-sm text-sw-gray-600">
                      <EditableCell
                        value={project.estimated_weeks}
                        onChange={(val) => updateCell(project.id, 'estimated_weeks', val)}
                        type="number"
                        placeholder="0"
                      />
                    </td>
                    <td className="px-4 py-3 text-sm text-sw-gray-600">
                      <EditableCell
                        value={project.delivered_by}
                        onChange={(val) => updateCell(project.id, 'delivered_by', val)}
                        placeholder={t('projects.deliveredByPlaceholder')}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge
                        value={project.project_status}
                        onChange={(val) => updateCell(project.id, 'project_status', val)}
                      />
                    </td>
                    <td className="px-4 py-3 text-sm text-sw-gray-600">
                      <EditableCell
                        value={project.owners}
                        onChange={(val) => updateCell(project.id, 'owners', val)}
                        type="select"
                        options={TEAM_OPTIONS}
                        placeholder={t('projects.selectTeam')}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => deleteProject(project.id)}
                        className="p-1 text-red-500 hover:bg-red-50 rounded"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 text-sm text-sw-gray-500">
        {t('projects.totalProjects')}: {projects.length}
      </div>
    </div>
  )
}
